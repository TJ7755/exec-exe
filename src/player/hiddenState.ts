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

// Monday flags — Meridian Infrastructure Services
export interface MondayHiddenState {
  // Onboarding
  signedAUPImmediately: boolean;
  readHandbookProperly: boolean;
  tomFlaggedSection73: boolean;

  // Nathaniel dynamic
  nathanielToldTruth: boolean;
  nathanielConfidenceInPlayer: 'high' | 'normal' | 'low';

  // Sheet reconciliation
  sheetReconciliationApproach: 'changed_numbers' | 'flagged_discrepancy' | 'asked_for_help' | null;
  sheetReconciliationTarget: 'green' | 'amber' | 'honest' | null;
  dashboardIntegrityCompromised: boolean;
  playerAddedNoteToNobody: boolean;
  playerBoughtTimeOnAmber: boolean;
  playerHeldLineOnData: boolean;

  // Harry Holmes dynamic
  harryBlamed: boolean;
  playerAcceptedHarryBlame: boolean;
  playerPushedBackOnHarry: boolean;
  harryErrorDocumented: boolean;

  // Rosa / Tom support
  askedRosaForHelp: boolean;
  askTomForContext: boolean;
  rosaTrustLevel: number;

  // Diane Osei (hospital)
  dianeEmailsReceived: number;
  dianeAlertAcknowledged: boolean;
  realWorldConsequenceTriggered: boolean;

  // Event tracking
  tomWelcomeSent: boolean;
  aupDecisionPending: boolean;
  nathanielOnboardingStarted: boolean;
  harryClaimedOwnershipOfDataset: boolean;
  rosaIntroductionSent: boolean;
  sheetTaskArrived: boolean;
  dianeFirstEmailDate: number | null;
  playerKnowsDashboardIsTheMetric: boolean;
  blr011Fixed: boolean;
  harryErrorCorrectedQuietly: boolean;
  harryErrorReportedToNathaniel: boolean;
  askedHarryAboutBLR011: boolean;
  acceptedHarryExplanation: boolean;
  delayedBLR011Fix: boolean;
  blr011ComplianceRisk: boolean;
}

// Tuesday flags — Meridian Infrastructure Services
export interface TuesdayHiddenState {
  // Claire Talker dynamic
  claireFirstContact: 'formal' | 'warm' | 'defensive' | null;
  claireRequirementsVersion: number;
  claireChangeAcknowledged: boolean;
  playerChallengedClaire: boolean;
  agreedToXMLWithoutChecking: boolean;
  askedForXMLSpec: boolean;
  challengedClaireRequirementChange: boolean;

  // James Siren dynamic
  sirenInteractionCount: number;
  playerUsedReligiousLanguage: boolean;
  playerQueuedForProcessReview: boolean;
  toldSirenTruth: boolean;
  acceptedHarryWalkthrough: boolean;

  // Standup outcomes
  madeGreenClaimInStandup: boolean;
  blr008EscalatedInStandup: boolean;
}

// Accumulating
export interface AccumulatingHiddenState {
  atlasAwareness: number;                      // 0–3, increments as player notices signals
  dashboardGreenStreak: number;                // consecutive days dashboard stayed green
  escalationRisk: 'low' | 'medium' | 'high' | 'critical';
}

// Full hidden state interface
export interface HiddenState extends MondayHiddenState, TuesdayHiddenState, AccumulatingHiddenState {}

// Initial state factory - all flags start at their default values
export const createInitialHiddenState = (): HiddenState => ({
  // Monday flags
  signedAUPImmediately: false,
  readHandbookProperly: false,
  tomFlaggedSection73: false,
  nathanielToldTruth: false,
  nathanielConfidenceInPlayer: 'normal',
  sheetReconciliationApproach: null,
  sheetReconciliationTarget: null,
  dashboardIntegrityCompromised: false,
  playerAddedNoteToNobody: false,
  playerBoughtTimeOnAmber: false,
  playerHeldLineOnData: false,
  harryBlamed: false,
  playerAcceptedHarryBlame: false,
  playerPushedBackOnHarry: false,
  harryErrorDocumented: false,
  askedRosaForHelp: false,
  askTomForContext: false,
  rosaTrustLevel: 0,
  dianeEmailsReceived: 0,
  dianeAlertAcknowledged: false,
  realWorldConsequenceTriggered: false,
  tomWelcomeSent: false,
  aupDecisionPending: false,
  nathanielOnboardingStarted: false,
  harryClaimedOwnershipOfDataset: false,
  rosaIntroductionSent: false,
  sheetTaskArrived: false,
  dianeFirstEmailDate: null,
  playerKnowsDashboardIsTheMetric: false,
  blr011Fixed: false,
  harryErrorCorrectedQuietly: false,
  harryErrorReportedToNathaniel: false,
  askedHarryAboutBLR011: false,
  acceptedHarryExplanation: false,
  delayedBLR011Fix: false,
  blr011ComplianceRisk: false,

  // Tuesday flags
  claireFirstContact: null,
  claireRequirementsVersion: 0,
  claireChangeAcknowledged: false,
  playerChallengedClaire: false,
  agreedToXMLWithoutChecking: false,
  askedForXMLSpec: false,
  challengedClaireRequirementChange: false,
  sirenInteractionCount: 0,
  playerUsedReligiousLanguage: false,
  playerQueuedForProcessReview: false,
  toldSirenTruth: false,
  acceptedHarryWalkthrough: false,
  madeGreenClaimInStandup: false,
  blr008EscalatedInStandup: false,

  // Accumulating
  atlasAwareness: 0,
  dashboardGreenStreak: 0,
  escalationRisk: 'low',
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
export const selectSignedAUPImmediately = selectHiddenFlag('signedAUPImmediately');
export const selectReadHandbookProperly = selectHiddenFlag('readHandbookProperly');
export const selectNathanielToldTruth = selectHiddenFlag('nathanielToldTruth');
export const selectDashboardIntegrityCompromised = selectHiddenFlag('dashboardIntegrityCompromised');
export const selectClaireRequirementsVersion = selectHiddenFlag('claireRequirementsVersion');
export const selectAtlasAwareness = selectHiddenFlag('atlasAwareness');
