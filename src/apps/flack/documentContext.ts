import { MeridianNPC, getNPCById } from "../../scenarios/meridian/npcs";

const documentCache = new Map<string, string>();

export const loadCharacterDoc = (npcId: string): string => {
  if (documentCache.has(npcId)) {
    return documentCache.get(npcId)!;
  }

  const npc = getNPCById(npcId);
  if (!npc) {
    return "";
  }

  const biography = `${npc.name} is ${npc.title} at Meridian Education Group.
  
VOICE AND REGISTER: ${npc.voice}

${npc.hardRules.join("\n")}

Style: ${npc.flackStyle}`;

  documentCache.set(npcId, biography);
  return biography;
};

export const loadBonusScenarios = (): string => {
  const cacheKey = "bonus_scenarios";
  if (documentCache.has(cacheKey)) {
    return documentCache.get(cacheKey)!;
  }

  const scenarios = "Bonus scenarios provide additional context for story prompts and character development.";
  documentCache.set(cacheKey, scenarios);
  return scenarios;
};

export const clearDocumentCache = (): void => {
  documentCache.clear();
};
