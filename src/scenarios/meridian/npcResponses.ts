/**
 * NPC Response Utility
 * 
 * Provides helper functions to retrieve and build NPC responses with
 * variable delays based on personality and response length.
 */

import { meridianNPCs } from './npcs';
import { ResponseBuilder, ResponseSection } from '../types';

/**
 * Get an NPC's response by response key (legacy - for backward compatibility)
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
  
  const response = npc.responses[responseKey];
  
  // If it's a simple string, return it
  if (typeof response === 'string') {
    return response;
  }
  
  // If it's a ResponseBuilder, build a default neutral response
  if (typeof response === 'object' && response.mainResponse) {
    return buildNPCResponse(npcId, responseKey, 'neutral');
  }
  
  return '[No response available]';
};

/**
 * Calculate NPC response delay based on personality and response length
 * @param npcId - The NPC's ID
 * @param responseLength - Length of the response text in characters
 * @returns Delay in milliseconds
 */
export const calculateNPCResponseDelay = (npcId: string, responseLength: number): number => {
  const npc = meridianNPCs.find(n => n.id === npcId);
  
  if (!npc) {
    console.warn(`[NPCResponse] NPC not found: ${npcId}`);
    return 1000;
  }
  
  const baseDelay = 1000;
  const speedMultiplier = npc.responseSpeed || 1.5;
  const lengthDelay = Math.floor(responseLength / 10) * 50;
  
  const totalDelay = (baseDelay + lengthDelay) * speedMultiplier;
  
  // Clamp between 800ms and 4000ms
  return Math.max(800, Math.min(4000, totalDelay));
};

/**
 * Build NPC response using the builder pattern
 * @param npcId - The NPC's ID
 * @param responseKey - The response key
 * @param reputation - Player's reputation with the NPC ('positive', 'neutral', 'negative')
 * @returns The built response text
 */
export const buildNPCResponse = (
  npcId: string,
  responseKey: string,
  reputation: 'positive' | 'neutral' | 'negative' = 'neutral'
): string => {
  const npc = meridianNPCs.find(n => n.id === npcId);
  
  if (!npc) {
    console.warn(`[NPCResponse] NPC not found: ${npcId}`);
    return '[Response not found]';
  }
  
  if (!npc.responses || !npc.responses[responseKey]) {
    console.warn(`[NPCResponse] Response key "${responseKey}" not found for NPC: ${npcId}`);
    return '[No response available]';
  }
  
  const response = npc.responses[responseKey];
  
  // If it's a simple string, return it (legacy support)
  if (typeof response === 'string') {
    return response;
  }
  
  // If it's a ResponseBuilder, build the response
  if (typeof response === 'object' && response.mainResponse) {
    const sections: string[] = [];
    
    // Add greeting if present
    if (response.greeting) {
      sections.push(selectRandomFromSection(response.greeting, reputation));
    }
    
    // Add acknowledgment if present
    if (response.acknowledgment) {
      sections.push(selectRandomFromSection(response.acknowledgment, reputation));
    }
    
    // Add main response (required)
    sections.push(selectRandomFromSection(response.mainResponse, reputation));
    
    // Add follow-up action if present
    if (response.followUpAction) {
      sections.push(selectRandomFromSection(response.followUpAction, reputation));
    }
    
    // Add closing if present
    if (response.closing) {
      sections.push(selectRandomFromSection(response.closing, reputation));
    }
    
    return sections.filter(s => s).join(' ');
  }
  
  return '[No response available]';
};

/**
 * Select a random string from a response section based on reputation
 * @param section - The response section
 * @param reputation - Player's reputation with the NPC
 * @returns A random string from the appropriate tone array
 */
const selectRandomFromSection = (
  section: ResponseSection,
  reputation: 'positive' | 'neutral' | 'negative'
): string => {
  const toneArray = section[reputation] || section.neutral || section.positive;
  
  if (!toneArray || toneArray.length === 0) {
    return '';
  }
  
  const randomIndex = Math.floor(Math.random() * toneArray.length);
  return toneArray[randomIndex];
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
