/**
 * NPC Response Helper
 * Fetches NPC follow-up responses from scenario data
 */

import { NPC } from './types';

/**
 * Get an NPC's response for a given response key
 * @param npcs - Array of NPCs from the scenario
 * @param npcId - The NPC ID to look up
 * @param responseKey - The key in the NPC's responses map
 * @returns The response text, or a fallback message if not found
 */
export const getNPCResponse = (
  npcs: NPC[],
  npcId: string,
  responseKey: string
): string => {
  const npc = npcs.find(n => n.id === npcId);
  
  if (!npc) {
    console.warn(`[NPC Response] NPC not found: ${npcId}`);
    return `[${npcId} acknowledges your response.]`;
  }
  
  if (!npc.responses || !(responseKey in npc.responses)) {
    console.warn(`[NPC Response] Key not found: ${responseKey} for NPC ${npcId}`);
    return `[${npc.name} nods in acknowledgment.]`;
  }
  
  return npc.responses[responseKey];
};

/**
 * Check if an NPC has a response for a given key
 * @param npcs - Array of NPCs from the scenario
 * @param npcId - The NPC ID to look up
 * @param responseKey - The key to check
 * @returns true if the response exists
 */
export const hasNPCResponse = (
  npcs: NPC[],
  npcId: string,
  responseKey: string
): boolean => {
  const npc = npcs.find(n => n.id === npcId);
  return npc?.responses ? responseKey in npc.responses : false;
};

/**
 * Get all available response keys for an NPC
 * @param npcs - Array of NPCs from the scenario
 * @param npcId - The NPC ID to look up
 * @returns Array of response keys, or empty array if NPC not found
 */
export const getNPCResponseKeys = (
  npcs: NPC[],
  npcId: string
): string[] => {
  const npc = npcs.find(n => n.id === npcId);
  return npc?.responses ? Object.keys(npc.responses) : [];
};
