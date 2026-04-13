/**
 * Dialogue Choice Store
 * Manages active and resolved DialogueChoices for Type A/B/C rendering
 */

import { DialogueChoice, ResolvedDialogue } from './types';

// Extended state interface
export interface DialogueChoiceState {
  activeChoices: DialogueChoice[];
  resolvedChoices: ResolvedDialogue[];
  // Legacy support
  activeDialogue: any | null;
  resolvedDialogues: ResolvedDialogue[];
}

// Action types
export const ADD_ACTIVE_CHOICE = 'ADD_ACTIVE_CHOICE';
export const RESOLVE_CHOICE = 'RESOLVE_CHOICE';
export const CLEAR_CHOICES = 'CLEAR_CHOICES';
// Legacy action types
export const SET_ACTIVE_DIALOGUE = 'SET_ACTIVE_DIALOGUE';
export const ADD_RESOLVED_DIALOGUE = 'ADD_RESOLVED_DIALOGUE';
export const CLEAR_DIALOGUE_HISTORY = 'CLEAR_DIALOGUE_HISTORY';

// Initial state
export const createInitialDialogueState = (): DialogueChoiceState => ({
  activeChoices: [],
  resolvedChoices: [],
  activeDialogue: null,
  resolvedDialogues: []
});

// New action creators
export const addActiveChoice = (choice: DialogueChoice) => ({
  type: ADD_ACTIVE_CHOICE,
  payload: choice
});

export const resolveChoice = (choiceId: string, chosenOptionId: string) => ({
  type: RESOLVE_CHOICE,
  payload: { choiceId, chosenOptionId }
});

export const clearChoices = () => ({
  type: CLEAR_CHOICES
});

// Legacy action creators (for backward compatibility)
export const setActiveDialogue = (dialogue: any | null) => ({
  type: SET_ACTIVE_DIALOGUE,
  payload: dialogue
});

export const addResolvedDialogue = (dialogue: ResolvedDialogue) => ({
  type: ADD_RESOLVED_DIALOGUE,
  payload: dialogue
});

export const clearDialogueHistory = () => ({
  type: CLEAR_DIALOGUE_HISTORY
});

// Selectors
export const selectDialogueState = (state: { player: { dialogue?: DialogueChoiceState } }) =>
  state.player.dialogue ?? createInitialDialogueState();

export const selectActiveChoices = (state: { player: { dialogue?: DialogueChoiceState } }) =>
  state.player.dialogue?.activeChoices ?? [];

export const selectActiveChoicesByContext = (context: 'flack_dm' | 'email' | 'standalone') =>
  (state: { player: { dialogue?: DialogueChoiceState } }): DialogueChoice[] => {
    const choices = state.player.dialogue?.activeChoices ?? [];
    return choices.filter(c => c.type === context);
  };

export const selectActiveChoiceForNPC = (npcId: string) =>
  (state: { player: { dialogue?: DialogueChoiceState } }): DialogueChoice | undefined => {
    const choices = state.player.dialogue?.activeChoices ?? [];
    return choices.find(c => c.type === 'flack_dm' && c.contextId === npcId);
  };

export const selectActiveChoiceForEmail = (emailId: string) =>
  (state: { player: { dialogue?: DialogueChoiceState } }): DialogueChoice | undefined => {
    const choices = state.player.dialogue?.activeChoices ?? [];
    return choices.find(c => c.type === 'email' && c.contextId === emailId);
  };

export const selectStandaloneChoices = (state: { player: { dialogue?: DialogueChoiceState } }): DialogueChoice[] => {
  const choices = state.player.dialogue?.activeChoices ?? [];
  return choices.filter(c => c.type === 'standalone');
};

// Legacy selectors
export const selectActiveDialogue = (state: { player: { dialogue?: DialogueChoiceState } }) =>
  state.player.dialogue?.activeDialogue ?? null;

export const selectResolvedDialogues = (state: { player: { dialogue?: DialogueChoiceState } }) =>
  state.player.dialogue?.resolvedDialogues ?? [];
