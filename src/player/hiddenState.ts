/**
 * Hidden State System
 * Part 2 — Hidden State System
 * 
 * This is the consequence engine. All flags are set by dialogue
 * choices and read by later events. Initialise all to their default on scenario start.
 * 
 * AI_HOOK: hiddenState will be injected into NPC system prompts as structured context.
 * Keep this object serialisable — no functions, no circular refs.
 */

// Action types
export const SET_HIDDEN_FLAG = 'SET_HIDDEN_FLAG';
export const SET_MULTIPLE_HIDDEN_FLAGS = 'SET_MULTIPLE_HIDDEN_FLAGS';
export const INCREMENT_ATLAS_AWARENESS = 'INCREMENT_ATLAS_AWARENESS';
export const RESET_HIDDEN_STATE = 'RESET_HIDDEN_STATE';

// Monday flags
export interface MondayHiddenState {
  signedHandbookImmediately: boolean;          // default: false
  derekFirstTaskApproach: 'committed' | 'asked_context' | 'looped_jess' | null;
  observedMarcusDerekDynamic: boolean;         // default: false
  nhsEmailTone: 'formal' | 'warm' | 'vague' | 'cc_chaos' | null;
  internalConfusionSignalled: boolean;         // default: false — true if cc_chaos
  knowsAboutSegmentation: boolean;             // default: false
  bluffedMarcusSegmentation: boolean;          // default: false
  jessOfferedContext: boolean;                 // default: false
  readHandbook: boolean;                       // default: false
  foundNHSContactIndependently: boolean;     // default: false
  jessProvidedNHSContext: boolean;           // default: false
  liedToDerekDay1: boolean;                  // default: false
  synergyCarlDelayed: boolean;               // default: false
  synergyEditAccess: boolean;                // default: false
  nhsEmailSent: boolean;                      // default: false
  nhsContactSource: 'jess' | 'intranet' | 'derek' | null;
}

// Tuesday flags
export interface TuesdayHiddenState {
  raisedSegmentationPublicly: boolean;         // default: false
  contractorBreakdownOwner: 'self' | 'deferred_to_derek' | 'ignored' | null;
  doubleBluffActive: boolean;                  // default: false
  nhs_relationship: 'positive' | 'neutral' | 'friction' | 'concerned' | null;
  nhs_segmentation_promise: boolean;           // default: false — CRITICAL if true
  nhs_poc: 'player' | 'shared' | null;
  statusUpdateStarted: boolean;                // default: false
  statusUpdateDeadline: 'wednesday' | 'thursday' | null;
  hasCallBriefFromJess: boolean;               // default: false
  derekReplied: boolean;                       // default: false
  derekThinksPlayerIsInnocent: boolean;      // default: false
  marcusKnowsYoureSharp: boolean;              // default: false
  schemaCommitment: 'end_of_week' | 'tomorrow_eod' | null;
  nhs_segmentation_expectation: 'managed' | 'deferred' | 'promised' | null;
}

// Accumulating
export interface AccumulatingHiddenState {
  atlasAwareness: number;                      // 0–3, increments as player notices signals
}

// Full hidden state interface
export interface HiddenState extends MondayHiddenState, TuesdayHiddenState, AccumulatingHiddenState {}

// Initial state factory - all flags start at their default values
export const createInitialHiddenState = (): HiddenState => ({
  // Monday flags
  signedHandbookImmediately: false,
  derekFirstTaskApproach: null,
  observedMarcusDerekDynamic: false,
  nhsEmailTone: null,
  internalConfusionSignalled: false,
  knowsAboutSegmentation: false,
  bluffedMarcusSegmentation: false,
  jessOfferedContext: false,
  readHandbook: false,
  foundNHSContactIndependently: false,
  jessProvidedNHSContext: false,
  liedToDerekDay1: false,
  synergyCarlDelayed: false,
  synergyEditAccess: false,
  nhsEmailSent: false,
  nhsContactSource: null,

  // Tuesday flags
  raisedSegmentationPublicly: false,
  contractorBreakdownOwner: null,
  doubleBluffActive: false,
  nhs_relationship: null,
  nhs_segmentation_promise: false,
  nhs_poc: null,
  statusUpdateStarted: false,
  statusUpdateDeadline: null,
  hasCallBriefFromJess: false,
  derekReplied: false,
  derekThinksPlayerIsInnocent: false,
  marcusKnowsYoureSharp: false,
  schemaCommitment: null,
  nhs_segmentation_expectation: null,

  // Accumulating
  atlasAwareness: 0,
});

// Type-safe helper for valid flag keys
type HiddenStateKey = keyof HiddenState;

// Action creators
export const setHiddenFlag = <K extends HiddenStateKey>(
  key: K,
  value: HiddenState[K]
) => {
  // Log in development mode
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log(`[HiddenState] Setting ${key}:`, value);
  }
  
  return {
    type: SET_HIDDEN_FLAG,
    payload: { key, value }
  };
};

export const setMultipleHiddenFlags = (flags: Partial<HiddenState>) => {
  // Log in development mode
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log('[HiddenState] Setting multiple flags:', flags);
  }
  
  return {
    type: SET_MULTIPLE_HIDDEN_FLAGS,
    payload: flags
  };
};

export const incrementAtlasAwareness = () => ({
  type: INCREMENT_ATLAS_AWARENESS
});

export const resetHiddenState = () => ({
  type: RESET_HIDDEN_STATE
});

// Selectors
export const selectHiddenState = (state: { player: { hiddenState?: HiddenState } }) =>
  state.player.hiddenState ?? createInitialHiddenState();

export const selectHiddenFlag = <K extends HiddenStateKey>(key: K) => 
  (state: { player: { hiddenState?: HiddenState } }): HiddenState[K] => {
    const hiddenState = state.player.hiddenState ?? createInitialHiddenState();
    return hiddenState[key];
  };

// Convenience selectors for commonly checked flags
export const selectSignedHandbookImmediately = selectHiddenFlag('signedHandbookImmediately');
export const selectDerekFirstTaskApproach = selectHiddenFlag('derekFirstTaskApproach');
export const selectNhsEmailTone = selectHiddenFlag('nhsEmailTone');
export const selectBluffedMarcusSegmentation = selectHiddenFlag('bluffedMarcusSegmentation');
export const selectKnowsAboutSegmentation = selectHiddenFlag('knowsAboutSegmentation');
export const selectRaisedSegmentationPublicly = selectHiddenFlag('raisedSegmentationPublicly');
export const selectNhsSegmentationPromise = selectHiddenFlag('nhs_segmentation_promise');
export const selectAtlasAwareness = selectHiddenFlag('atlasAwareness');
