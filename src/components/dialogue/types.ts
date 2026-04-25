/**
 * Dialogue Choice System Types
 * Part 3 — Dialogue Choice System
 * 
 * Build a reusable DialogueChoice component. This renders whenever a scripted
 * interaction requires player input.
 * 
 * AI_HOOK: when AI is integrated, onResolved will additionally fire an AI
 * generation request using the chosen option as a constraint.
 */

import type { PlayerStats } from '../../player/types';
import type { HiddenState } from '../../player/hiddenState';

export interface StatDeltas {
  stress?: number;
  energy?: number;
  salary?: number;
  performanceScore?: number;
}

export interface RepDeltas {
  [npcId: string]: number;
}

export interface DialogueOption {
  id: string;
  label: string;                    // the text shown on the button AND sent as player message
  subtext?: string;                 // optional small grey hint text beneath label
  disabled?: boolean;
  consequences: {
    statDeltas?: StatDeltas;           // e.g. { stress: +5 }
    repDeltas?: RepDeltas;               // e.g. { derek: +2, marcus: -1 }
    hiddenFlags?: Partial<HiddenState>;  // flags to set
    triggerEventIds?: string[];          // schedules follow-up events
    unlockInfo?: string;                 // text shown in a "You learned:" aside
    npcFollowUpKey?: string;             // key into NPC response map for their reply
  };
}

export interface DialogueChoiceProps {
  npcId: string;                    // whose message this is attached to
  prompt: string;                   // the NPC's message text
  options: DialogueOption[];
  onResolved: (chosenId: string, option: DialogueOption) => void;
  context?: 'outbox' | 'flack' | 'terminal' | 'system';  // which app to render in
  threadId?: string;                // email thread or DM thread
  allowTypedResponse?: boolean;     // AI_HOOK: allow typed response when AI is integrated
}

// Active dialogue choice (for storage in player state)
export interface DialogueChoice {
  id: string;
  type: 'flack_dm' | 'email' | 'standalone';
  contextId: string;                  // npcId for flack_dm, emailId for email
  prompt?: string;
  options: DialogueOption[];
  resolvedOptionId: string | null;    // null until player chooses
}

// For storing the full option set (needed for AI integration)
export interface ResolvedDialogue {
  id: string;
  npcId: string;
  prompt: string;
  options: DialogueOption[];        // Full set, not just chosen
  chosenOptionId: string;
  timestamp: string;
  isAiGenerated: boolean;
  aiModel?: string;
  fallbackContent: string;           // The static player reply text
}

// For storing resolved choice history
export interface ResolvedChoice {
  choiceId: string;
  chosenOptionId: string;
  allOptions: DialogueOption[];
  gameDay: number;
  gameMinute: number;
  context: string;
}

// State tracking for active dialogue
export interface DialogueState {
  activeDialogue: DialogueChoiceProps | null;
  activeChoice: DialogueChoice | null;  // NEW: current active choice
  resolvedDialogues: ResolvedDialogue[];
  resolvedChoices: ResolvedChoice[];    // NEW: full choice history
}
