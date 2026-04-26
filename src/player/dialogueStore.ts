/**
 * Dialogue State Store
 * Manages active and resolved dialogues and choices
 */

import { DialogueChoiceProps, ResolvedDialogue, DialogueState as ImportedDialogueState, DialogueChoice, ResolvedChoice } from '../components/dialogue/types';

// Re-export the type for use in other modules
export type DialogueState = ImportedDialogueState;

// Action types
export const SET_ACTIVE_DIALOGUE = 'SET_ACTIVE_DIALOGUE';
export const ADD_RESOLVED_DIALOGUE = 'ADD_RESOLVED_DIALOGUE';
export const CLEAR_DIALOGUE_HISTORY = 'CLEAR_DIALOGUE_HISTORY';

// New action types for DialogueChoice system
export const SET_ACTIVE_CHOICE = 'SET_ACTIVE_CHOICE';
export const RESOLVE_CHOICE = 'RESOLVE_CHOICE';
export const ADD_RESOLVED_CHOICE = 'ADD_RESOLVED_CHOICE';
export const CLEAR_CHOICE_HISTORY = 'CLEAR_CHOICE_HISTORY';

// Initial state
export const createInitialDialogueState = (): DialogueState => ({
  activeDialogue: null,
  activeChoice: null,
  resolvedDialogues: [],
  resolvedChoices: []
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

// New action creators for DialogueChoice system
export const setActiveChoice = (choice: DialogueChoice | null) => ({
  type: SET_ACTIVE_CHOICE,
  payload: choice
});

export const resolveChoice = (choiceId: string, optionId: string) => ({
  type: RESOLVE_CHOICE,
  payload: { choiceId, optionId }
});

export const addResolvedChoice = (resolvedChoice: ResolvedChoice) => ({
  type: ADD_RESOLVED_CHOICE,
  payload: resolvedChoice
});

export const clearChoiceHistory = () => ({
  type: CLEAR_CHOICE_HISTORY
});

// Selectors
export const selectDialogueState = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue ?? createInitialDialogueState();

export const selectActiveDialogue = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.activeDialogue ?? null;

export const selectResolvedDialogues = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.resolvedDialogues ?? [];

// New selectors for DialogueChoice system
export const selectActiveChoice = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.activeChoice ?? null;

export const selectActiveChoiceForContext = (contextId: string) => (state: { player: { dialogue?: DialogueState } }) => {
  const activeChoice = state.player.dialogue?.activeChoice;
  if (activeChoice && activeChoice.contextId === contextId && !activeChoice.resolvedOptionId) {
    return activeChoice;
  }
  return null;
};

export const selectResolvedChoices = (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.resolvedChoices ?? [];

export const selectResolvedChoiceForContext = (contextId: string) => (state: { player: { dialogue?: DialogueState } }) =>
  state.player.dialogue?.resolvedChoices?.find(c => c.context === contextId) ?? null;

// Reducer for handling DialogueChoice actions
export const dialogueReducer = (state: DialogueState = createInitialDialogueState(), action: any): DialogueState => {
  try {
    // Defensive check: ensure state is a valid object
    const safeState = (state && typeof state === 'object' && !Array.isArray(state)) ? state : createInitialDialogueState();

    switch (action.type) {
      case SET_ACTIVE_DIALOGUE:
        return { ...safeState, activeDialogue: action.payload };
      case ADD_RESOLVED_DIALOGUE:
        return { ...safeState, resolvedDialogues: [...(Array.isArray(safeState.resolvedDialogues) ? safeState.resolvedDialogues : []), action.payload] };
      case CLEAR_DIALOGUE_HISTORY:
        return { ...safeState, resolvedDialogues: [] };
      case SET_ACTIVE_CHOICE:
        return { ...safeState, activeChoice: action.payload };
      case RESOLVE_CHOICE:
        if (safeState.activeChoice && safeState.activeChoice.id === action.payload.choiceId) {
          return {
            ...safeState,
            activeChoice: {
              ...safeState.activeChoice,
              resolvedOptionId: action.payload.optionId
            }
          };
        }
        return safeState;
      case ADD_RESOLVED_CHOICE:
        return { ...safeState, resolvedChoices: [...(Array.isArray(safeState.resolvedChoices) ? safeState.resolvedChoices : []), action.payload] };
      case CLEAR_CHOICE_HISTORY:
        return { ...safeState, resolvedChoices: [] };
      default:
        return safeState;
    }
  } catch (e) {
    console.error('[dialogueReducer] Error:', e);
    return createInitialDialogueState();
  }
};
