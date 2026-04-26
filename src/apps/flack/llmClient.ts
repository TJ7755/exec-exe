import { OPENROUTER_KEY_STORAGE, OPENROUTER_MODEL_ID, GEMINI_KEY_STORAGE, GEMINI_MODEL_ID, LLM_REQUEST_TIMEOUT_MS, LLM_CHARACTER_COOLDOWN_MS, LLMProvider } from "../../utils/constants";
import { MeridianNPC, getNPCById } from "../../scenarios/meridian/npcs";
import { FlackGameContext } from "../../player/types";
import { getGeminiKey, getOpenRouterKey, getAvailableProviders } from "./apiKeyManager";
import { loadCharacterDoc } from "./documentContext";

export interface ConversationTurn {
  role: "player" | "character";
  content: string;
}


export interface LlmRequest {
  npcId: string;
  playerInput: string;
  history: ConversationTurn[];
  gameContext: FlackGameContext;
}

const GENERIC_HARRY_GIF = "[GIF: man nodding too confidently]";
const FORBIDDEN_TERMS = ["ai", "game", "developer", "fourth wall", "system prompt", "character", "fiction", "simulate", "pretend"];

const characterFallbacks: Record<string, Record<string, string[]>> = {
  nathaniel: {
    technical: [
      "GOOD MORNING HOW ARE YOU\nLet me look into that and cascade it upwards.\nNathaniel",
      "GOOD AFTERNOON HOW ARE YOU\nThat should be broadly fine from my side. I will flag it.\nNathaniel",
    ],
    personal: [
      "GOOD MORNING HOW ARE YOU\nAll broadly positive here. Slightly busy. Surf forecast is mixed.\nNathaniel",
    ],
    general: [
      "GOOD MORNING HOW ARE YOU\nEverything is broadly on track. Let me know if anything becomes a blocker.\nNathaniel",
    ],
    close: [
      "GOOD AFTERNOON HOW ARE YOU\nNo worries at all. ON THAT CLIMATE RELATED BOMBSHELL,\nNathaniel",
    ],
  },
  harry: {
    technical: [
      `yeah I'd probably approach it slightly differently but honestly it's fine ${GENERIC_HARRY_GIF}`,
      `bit clunky but should still work tbf ${GENERIC_HARRY_GIF}`,
    ],
    personal: [
      `ha yeah all good on my end mate ${GENERIC_HARRY_GIF}`,
    ],
    general: [
      `seen worse honestly. you're fine ${GENERIC_HARRY_GIF}`,
      `i'd just keep moving tbh ${GENERIC_HARRY_GIF}`,
    ],
    close: [
      `all good. shout if you need the expert view ${GENERIC_HARRY_GIF}`,
    ],
  },
  sara: {
    technical: [
      "oof yeah. i'd probably ask nathaniel on that one.",
      "that's a very meridian problem, honestly. maybe leave it a sec.",
    ],
    personal: [
      "i'm good. surviving. peaches are doing heavy lifting.",
    ],
    general: [
      "yeah that tracks. let me know if you need the client-facing version of events.",
      "honestly? cap everywhere. but manageable.",
    ],
    close: [
      "cool. catch you later.",
    ],
  },
  paul: {
    technical: [
      "That is covered in the handbook. Read it properly. Paul",
      "The instructions were clear. Review them. Paul",
    ],
    personal: [
      "I am working. Paul",
    ],
    general: [
      "Not my area. Ask someone else. Paul",
    ],
    close: [
      "Do carry on. Paul",
    ],
  },
  james: {
    technical: [
      "That is worth thinking about carefully. Do continue. With every good wish, Dr James Siren",
      "Attend to the wording first. It often matters more than people think. With every good wish, Dr James Siren",
    ],
    personal: [
      "I appreciate the question. Attend first to the work before you. With every good wish, Dr James Siren",
    ],
    general: [
      "Most things worth examining take time to examine. Keep looking.",
      "That may become clearer with patient attention. With every good wish, Dr James Siren",
    ],
    close: [
      "Do carry on. With every good wish, Dr James Siren",
    ],
  },
  carol: {
    general: [""],
  },
};

const lastRequestAt = new Map<string, number>();
const providerFailures = new Map<LLMProvider, number>();
const requestQueue: Array<() => Promise<void>> = [];
let queueRunning = false;
let messageIdCounter = 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getCharacterStateSlice = (npcId: string, fullContext: FlackGameContext): Partial<FlackGameContext> => {
  const baseState = {
    day: fullContext.day,
    inGameTime: fullContext.inGameTime,
    stressBand: fullContext.stressBand,
  };

  switch (npcId) {
    case "nathaniel":
      return {
        ...baseState,
        harrowfieldSectionsComplete: fullContext.harrowfieldSectionsComplete,
      };
    case "harry":
      return {
        ...baseState,
        harrySectionsHandled: fullContext.harrySectionsHandled,
      };
    case "sara":
      return baseState;
    case "paul":
      return {
        ...baseState,
        paulTasksFailed: fullContext.paulTasksFailed,
        mpiQuizQ5AnsweredCorrectly: fullContext.mpiQuizQ5AnsweredCorrectly,
      };
    case "james":
      return {
        ...baseState,
        execTermOpened: fullContext.execTermOpened,
        archiveAccessed: fullContext.archiveAccessed,
        jamesDialogueChoices: fullContext.jamesDialogueChoices,
      };
    case "carol":
      return {
        ...baseState,
        carolConfrontations: fullContext.carolConfrontations,
        harrowfieldSectionsComplete: fullContext.harrowfieldSectionsComplete,
      };
    default:
      return baseState;
  }
};

const categoriseInput = (input: string): "technical" | "personal" | "close" | "general" => {
  const normalised = input.toLowerCase();
  if (/(thanks|cheers|bye|all good|no worries)/.test(normalised)) {
    return "close";
  }
  if (/(you|morning|weekend|coffee|how are you|personal)/.test(normalised)) {
    return "personal";
  }
  if (/(login|system|technical|handbook|document|archive|folder|data|quiz|chapter)/.test(normalised)) {
    return "technical";
  }
  return "general";
};

const buildSystemPrompt = (npc: MeridianNPC, request: LlmRequest): string => {
  const characterState = getCharacterStateSlice(npc.id, request.gameContext);
  const trueFlags = Object.entries(request.gameContext.flags)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const maxWords = npc.validationConfig?.maxWords ?? 80;
  const characterBiography = loadCharacterDoc(npc.id);

  const forbiddenTopics = npc.validationConfig?.forbiddenTopics || [];
  const forbiddenList = [...FORBIDDEN_TERMS, ...forbiddenTopics].join(", ");

  return `You are ${npc.name}, ${npc.title} at Meridian Education Group.

${characterBiography}

CURRENT STATE:
- Day: ${characterState.day}
- In-game time: ${characterState.inGameTime}
- Stress band: ${characterState.stressBand}
${characterState.harrowfieldSectionsComplete ? `- Harrowfield sections complete: ${characterState.harrowfieldSectionsComplete.join(", ")}` : ""}
${characterState.harrySectionsHandled ? `- Harry sections handled: ${Object.entries(characterState.harrySectionsHandled).map(([k, v]) => `${k}: ${v}`).join(", ")}` : ""}
${characterState.paulTasksFailed !== undefined ? `- Paul tasks failed: ${characterState.paulTasksFailed}` : ""}
${characterState.carolConfrontations !== undefined ? `- Carol confrontations: ${characterState.carolConfrontations}` : ""}
${characterState.execTermOpened !== undefined ? `- ExecuTerm opened: ${characterState.execTermOpened}` : ""}
${characterState.archiveAccessed !== undefined ? `- Archive accessed: ${characterState.archiveAccessed}` : ""}
${characterState.mpiQuizQ5AnsweredCorrectly !== undefined ? `- MPI Quiz Q5 answered correctly: ${characterState.mpiQuizQ5AnsweredCorrectly}` : ""}
- Active flags: ${trueFlags.join(", ") || "none"}

FORMAT REQUIREMENTS:
- Maximum ${maxWords} words.
- Respond as a Flack instant message only.
- Do not use markdown, HTML, or JSON.
- ${npc.flackStyle}

SPELLING REQUIREMENTS:
- Use British English spelling: colour, favour, centre, programme, organise, analyse, licence, defence, offence, practise, manoeuvre, catalogue, dialogue, metre, theatre, sceptre, litre, tyre, aluminium, jewellery, etc.

HARD CONSTRAINTS:
- ${npc.hardRules.join("\n- ")}
- Do not acknowledge being an AI.
- Do not reference the game, fiction, simulation, or being a character.
- Forbidden topics: ${forbiddenList}`;
};

const buildMessages = (npc: MeridianNPC, request: LlmRequest) => {
  const history = request.history.slice(-8).flatMap((turn) => [
    {
      role: turn.role === "player" ? "user" : "assistant",
      content: turn.content,
    },
  ]);

  return [
    { role: "system", content: buildSystemPrompt(npc, request) },
    ...history,
    { role: "user", content: request.playerInput },
  ];
};

const validateResponse = (npc: MeridianNPC, request: LlmRequest, raw: string): string | null => {
  if (npc.id === "carol" && request.gameContext.day === 1) {
    return null;
  }

  const cleaned = raw.trim();
  if (!cleaned) {
    return null;
  }

  const lower = cleaned.toLowerCase();
  if (FORBIDDEN_TERMS.some((term) => lower.includes(term))) {
    return null;
  }

  const config = npc.validationConfig;
  if (!config) {
    return cleaned;
  }

  // Handle GIF requirements
  if (!config.allowGifs && /\[GIF:.*?\]/i.test(cleaned)) {
    return cleaned.replace(/\s*\[GIF:.*?\]\s*/gi, " ").replace(/\s+/g, " ").trim();
  }

  if (config.requireGif && !/\[GIF:.*?\]/i.test(cleaned)) {
    if (npc.id === "harry") {
      return `${cleaned} ${GENERIC_HARRY_GIF}`.trim();
    }
    return null;
  }

  // Check word count with sentence-boundary truncation
  const withoutGifs = cleaned.replace(/\[GIF:.*?\]/gi, "").trim();
  let wordCount = withoutGifs.split(/\s+/).filter(Boolean).length;
  
  if (wordCount > config.maxWords) {
    // Truncate at sentence boundary
    const sentences = withoutGifs.match(/[^.!?]+[.!?]+/g) || [withoutGifs];
    let truncated = "";
    let truncatedCount = 0;
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.trim().split(/\s+/).filter(Boolean).length;
      if (truncatedCount + sentenceWords <= config.maxWords) {
        truncated += sentence.trim() + " ";
        truncatedCount += sentenceWords;
      } else {
        break;
      }
    }
    
    if (truncatedCount < config.minWords) {
      return null;
    }
    
    // Preserve GIF tags if present
    const gifMatch = cleaned.match(/\[GIF:.*?\]/i);
    if (gifMatch) {
      truncated = truncated.trim() + " " + gifMatch[0];
    }
    
    return truncated.trim();
  }
  
  if (wordCount < config.minWords) {
    return null;
  }

  // Check forbidden topics
  for (const topic of config.forbiddenTopics) {
    try {
      if (new RegExp(topic, "i").test(cleaned)) {
        return null;
      }
    } catch (e) {
      // If regex is invalid, treat as literal string match
      if (lower.includes(topic.toLowerCase())) {
        return null;
      }
    }
  }

  // Check plot-specific forbidden topics per character
  const plotForbiddenTopics: Record<string, string[]> = {
    nathaniel: ["archive", "password", "meridian2019", "47 schools"],
    harry: ["meridian2019", "47 schools", "archive contents"],
    james: ["archive", "47", "wrong with meridian", "discrepancy"],
  };

  const characterPlotTopics = plotForbiddenTopics[npc.id] || [];
  for (const topic of characterPlotTopics) {
    if (lower.includes(topic.toLowerCase())) {
      return null;
    }
  }

  return cleaned;
};

const pickFallback = (npcId: string, playerInput: string): string => {
  const bucket = characterFallbacks[npcId] || characterFallbacks.nathaniel;
  const category = categoriseInput(playerInput);
  const options = bucket[category] || bucket.general || [""];
  return options[Math.floor(Math.random() * options.length)];
};

const selectProvider = (): LLMProvider | null => {
  const available = getAvailableProviders();
  if (available.length === 0) {
    return null;
  }
  
  const geminiKey = getGeminiKey();
  if (geminiKey && !providerFailures.has(LLMProvider.GEMINI)) {
    return LLMProvider.GEMINI;
  }
  
  const openRouterKey = getOpenRouterKey();
  if (openRouterKey && !providerFailures.has(LLMProvider.OPENROUTER)) {
    return LLMProvider.OPENROUTER;
  }
  
  if (geminiKey) {
    return LLMProvider.GEMINI;
  }
  
  if (openRouterKey) {
    return LLMProvider.OPENROUTER;
  }
  
  return null;
};

const callLLMWithFallback = async (npc: MeridianNPC, request: LlmRequest): Promise<string | null> => {
  const primaryProvider = selectProvider();
  if (!primaryProvider) {
    return null;
  }

  let result: string | null = null;
  
  if (primaryProvider === LLMProvider.GEMINI) {
    const geminiKey = getGeminiKey();
    if (geminiKey) {
      result = await callGemini(npc, request, geminiKey);
      if (result === null) {
        providerFailures.set(LLMProvider.GEMINI, Date.now());
        const openRouterKey = getOpenRouterKey();
        if (openRouterKey) {
          result = await callOpenRouter(npc, request, openRouterKey);
          if (result === null) {
            providerFailures.set(LLMProvider.OPENROUTER, Date.now());
          }
        }
      }
    }
  } else {
    const openRouterKey = getOpenRouterKey();
    if (openRouterKey) {
      result = await callOpenRouter(npc, request, openRouterKey);
      if (result === null) {
        providerFailures.set(LLMProvider.OPENROUTER, Date.now());
        const geminiKey = getGeminiKey();
        if (geminiKey) {
          result = await callGemini(npc, request, geminiKey);
          if (result === null) {
            providerFailures.set(LLMProvider.GEMINI, Date.now());
          }
        }
      }
    }
  }

  return result;
};

const callGemini = async (npc: MeridianNPC, request: LlmRequest, apiKey: string, retryCount = 0): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), LLM_REQUEST_TIMEOUT_MS);

  try {
    const messages = buildMessages(npc, request);
    
    const geminiContents = messages.map(msg => ({
      role: msg.role === "system" ? "user" : msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: {
          temperature: npc.llmTemperature,
          maxOutputTokens: 200,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status >= 500 && retryCount < 2) {
        window.clearTimeout(timeout);
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        await wait(backoffDelay);
        return callGemini(npc, request, apiKey, retryCount + 1);
      }
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    if (retryCount < 2 && error instanceof Error && error.name !== 'AbortError') {
      window.clearTimeout(timeout);
      const backoffDelay = Math.pow(2, retryCount) * 1000;
      await wait(backoffDelay);
      return callGemini(npc, request, apiKey, retryCount + 1);
    }
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};

const callOpenRouter = async (npc: MeridianNPC, request: LlmRequest, apiKey: string, retryCount = 0): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), LLM_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "EXEC.EXE",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL_ID,
        messages: buildMessages(npc, request),
        max_tokens: 200,
        temperature: npc.llmTemperature,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status >= 500 && retryCount < 2) {
        window.clearTimeout(timeout);
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        await wait(backoffDelay);
        return callOpenRouter(npc, request, apiKey, retryCount + 1);
      }
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch (error) {
    if (retryCount < 2 && error instanceof Error && error.name !== 'AbortError') {
      window.clearTimeout(timeout);
      const backoffDelay = Math.pow(2, retryCount) * 1000;
      await wait(backoffDelay);
      return callOpenRouter(npc, request, apiKey, retryCount + 1);
    }
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
};

const runQueue = async () => {
  if (queueRunning) {
    return;
  }

  queueRunning = true;
  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      await task();
    }
  }
  queueRunning = false;
};

export const getFlackReply = (request: LlmRequest): Promise<string> =>
  new Promise((resolve) => {
    requestQueue.push(async () => {
      const npc = getNPCById(request.npcId);
      if (!npc) {
        resolve("");
        return;
      }

      if (npc.id === "carol" && request.gameContext.day === 1) {
        resolve("");
        return;
      }

      // Calculate cooldown at execution time, not queue time
      const now = Date.now();
      const lastAt = lastRequestAt.get(npc.id) ?? 0;
      const waitForCooldown = Math.max(0, LLM_CHARACTER_COOLDOWN_MS - (now - lastAt));
      if (waitForCooldown > 0) {
        await wait(waitForCooldown);
      }
      lastRequestAt.set(npc.id, Date.now());

      const raw = await callLLMWithFallback(npc, request);
      const validated = raw ? validateResponse(npc, request, raw) : null;
      resolve(validated ?? pickFallback(npc.id, request.playerInput));
    });

    runQueue();
  });

