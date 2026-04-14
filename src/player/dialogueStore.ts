/**
 * Dialogue State Store
 * Manages active and resolved dialogues
 */

import { DialogueChoiceProps, ResolvedDialogue, DialogueState as ImportedDialogueState } from '../components/dialogue/types';

// Re-export the type for use in other modules
export type DialogueState = ImportedDialogueState;

// Action types
export const SET_ACTIVE_DIALOGUE = 'SET_ACTIVE_DIALOGUE';
export const ADD_RESOLVED_DIALOGUE = 'ADD_RESOLVED_DIALOGUE';
export const CLEAR_DIALOGUE_HISTORY = 'CLEAR_DIALOGUE_HISTORY';

// Initial state
export const createInitialDialogueState = (): DialogueState => ({
  activeDialogue: null,
  resolvedDialogues: []
});

// Action creators
export const setActiveDialogue = (dialogue: DialogueChoiceProps | null) => ({
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
export const selectDialogueState = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue ?? createInitialDialogueState();

export const selectActiveDialogue = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.activeDialogue ?? null;

export const selectResolvedDialogues = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.resolvedDialogues ?? [];
