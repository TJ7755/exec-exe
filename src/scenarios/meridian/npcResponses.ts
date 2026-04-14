/**
 * NPC Response Utility
 * 
 * Provides a helper function to retrieve NPC responses by ID and response key.
 * Falls back to a generic message if the response is not found.
 */

import { meridianNPCs } from './npcs';

/**
 * Get an NPC's response by response key
 * @param npcId - The NPC's ID (e.g., 'nathaniel', 'claire')
 * @param responseKey - The response key from dialogue choice consequences
 * @returns The response text, or a generic fallback if not found
 */
export const getNPCResponse = (npcId: string, responseKey: string): string => {
  const npc = meridianNPCs.find(n => n.id === npcId);
  
  if (!npc) {
    console.warn(`[NPCResponse] NPC not found: ${npcId}`);
    return '[Response not found]';
  }
  
  if (!npc.responses || !npc.responses[responseKey]) {
    console.warn(`[NPCResponse] Response key "${responseKey}" not found for NPC: ${npcId}`);
    return '[No response available]';
  }
  
  return npc.responses[responseKey];
};

/**
 * Check if an NPC has a specific response key
 * @param npcId - The NPC's ID
 * @param responseKey - The response key to check
 * @returns true if the response exists, false otherwise
 */
export const hasNPCResponse = (npcId: string, responseKey: string): boolean => {
  const npc = meridianNPCs.find(n => n.id === npcId);
  return !!(npc && npc.responses && npc.responses[responseKey]);
};
