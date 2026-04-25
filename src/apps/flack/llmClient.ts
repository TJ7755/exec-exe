import { OPENROUTER_KEY_STORAGE, OPENROUTER_MODEL_ID } from "../../utils/constants";
import { MeridianNPC, getNPCById } from "../../scenarios/meridian/npcs";
import { StressBand } from "../../player/gameState";

export interface ConversationTurn {
  role: "player" | "character";
  content: string;
}

export interface FlackGameContext {
  day: number;
  inGameTime: string;
  stressBand: StressBand;
  flags: Record<string, boolean>;
  paulTasksFailed?: number;
  carolConfrontations?: number;
  harrowfieldSectionsComplete?: string[];
  harrySectionsHandled?: Record<string, string>;
  jamesDialogueChoices?: Record<string, string | null>;
}

export interface LlmRequest {
  npcId: string;
  playerInput: string;
  history: ConversationTurn[];
  gameContext: FlackGameContext;
}

const REQUEST_TIMEOUT_MS = 8000;
const CHARACTER_COOLDOWN_MS = 3000;
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
const requestQueue: Array<() => Promise<void>> = [];
let queueRunning = false;
let messageIdCounter = 0;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getApiKey = (): string | null => {
  try {
    return localStorage.getItem(OPENROUTER_KEY_STORAGE);
  } catch (error) {
    return null;
  }
};

export const promptForApiKey = (): string | null => {
  const existing = getApiKey();
  if (existing) {
    return existing;
  }

  const key = window.prompt("Enter your OpenRouter API key for Flack free-text replies.");
  if (!key) {
    return null;
  }

  try {
    localStorage.setItem(OPENROUTER_KEY_STORAGE, key.trim());
  } catch (error) {
    console.error("Failed to store OpenRouter key", error);
  }

  return key.trim();
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
  const trueFlags = Object.entries(request.gameContext.flags)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const maxWords = npc.validationConfig?.maxWords ?? 80;

  return `You are ${npc.name}, ${npc.title} at Meridian Education Group.
VOICE AND REGISTER: ${npc.voice}
CURRENT STATE: Day ${request.gameContext.day}. In-game time: ${request.gameContext.inGameTime}. Stress band: ${request.gameContext.stressBand}.
ACTIVE FLAGS: ${trueFlags.join(", ") || "none"}.
FORMAT REQUIREMENTS:
- Maximum ${maxWords} words.
- Respond as a Flack instant message only.
- Do not use markdown, HTML, or JSON.
- ${npc.flackStyle}
HARD CONSTRAINTS:
- ${npc.hardRules.join("\n- ")}
- Do not acknowledge being an AI.
- Do not reference the game.`;
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

  // Check word count
  const withoutGifs = cleaned.replace(/\[GIF:.*?\]/gi, "").trim();
  const wordCount = withoutGifs.split(/\s+/).filter(Boolean).length;
  if (wordCount < config.minWords || wordCount > config.maxWords) {
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

  return cleaned;
};

const pickFallback = (npcId: string, playerInput: string): string => {
  const bucket = characterFallbacks[npcId] || characterFallbacks.nathaniel;
  const category = categoriseInput(playerInput);
  const options = bucket[category] || bucket.general || [""];
  return options[Math.floor(Math.random() * options.length)];
};

const callOpenRouter = async (npc: MeridianNPC, request: LlmRequest, apiKey: string, retryCount = 0): Promise<string | null> => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
      const waitForCooldown = Math.max(0, CHARACTER_COOLDOWN_MS - (now - lastAt));
      if (waitForCooldown > 0) {
        await wait(waitForCooldown);
      }
      lastRequestAt.set(npc.id, Date.now());

      const apiKey = promptForApiKey();
      if (!apiKey) {
        resolve(pickFallback(npc.id, request.playerInput));
        return;
      }

      const raw = await callOpenRouter(npc, request, apiKey);
      const validated = raw ? validateResponse(npc, request, raw) : null;
      resolve(validated ?? pickFallback(npc.id, request.playerInput));
    });

    runQueue();
  });

