import { HiddenState, selectHiddenState, setHiddenFlag, setMultipleHiddenFlags } from "./hiddenState";
import { selectCurrentGameMinutes, GameTime } from "./gameTime";

export const MERIDIAN_FLAGS = [
  "ARCHIVE_ACCESSED",
  "OFSTED_SUBMITTED",
  "EXECUTERM_OPENED",
  "FOI_BOOKMARKED",
  "HARRY_S3_REDONE",
  "CAROL_CONFRONTED",
  "MPI_QUIZ_Q5_ANSWERED_CORRECTLY",
  "CORRECT_HEADERS_USED",
  "HR_FORM_COMPLETED",
  "INTRODUCTION_POSTED",
] as const;

export type MeridianFlagKey = (typeof MERIDIAN_FLAGS)[number];

export type StressBand = "low" | "medium" | "high" | "critical";

export const DAY_START_MINUTES = 0;
export const DAY_END_MINUTES = 480;

export const createInitialMeridianFlags = (): Pick<HiddenState, MeridianFlagKey> => ({
  ARCHIVE_ACCESSED: false,
  OFSTED_SUBMITTED: false,
  EXECUTERM_OPENED: false,
  FOI_BOOKMARKED: false,
  HARRY_S3_REDONE: false,
  CAROL_CONFRONTED: false,
  MPI_QUIZ_Q5_ANSWERED_CORRECTLY: false,
  CORRECT_HEADERS_USED: false,
  HR_FORM_COMPLETED: false,
  INTRODUCTION_POSTED: false,
});

export const clampStress = (stress: number): number => {
  if (Number.isNaN(stress)) {
    return 20;
  }

  return Math.max(0, Math.min(100, Math.round(stress)));
};

export const getStressBand = (stress: number): StressBand => {
  if (stress > 85) {
    return "critical";
  }

  if (stress > 70) {
    return "high";
  }

  if (stress < 30) {
    return "low";
  }

  return "medium";
};

export const calculateOvertimeStress = (fromMinutes: number, toMinutes: number): number => {
  if (toMinutes <= DAY_END_MINUTES) {
    return 0;
  }

  const overtimeStart = Math.max(fromMinutes, DAY_END_MINUTES);
  const overtimeMinutes = Math.max(0, toMinutes - overtimeStart);

  if (overtimeMinutes === 0) {
    return 0;
  }

  return Math.ceil(overtimeMinutes / 60) * 2;
};

export const setMeridianFlag = <K extends MeridianFlagKey>(flag: K, value: HiddenState[K] = true as HiddenState[K]) =>
  setHiddenFlag(flag, value);

export const setMeridianFlags = (flags: Partial<Pick<HiddenState, MeridianFlagKey>>) =>
  setMultipleHiddenFlags(flags);

export const selectMeridianFlags = (state: { player: { hiddenState?: HiddenState } }) => {
  const hiddenState = selectHiddenState(state);
  const flags = {} as Pick<HiddenState, MeridianFlagKey>;

  MERIDIAN_FLAGS.forEach((flag) => {
    flags[flag] = hiddenState[flag] ?? false;
  });

  return flags;
};

export const selectMeridianFlag = (flag: MeridianFlagKey) => (state: { player: { hiddenState?: HiddenState } }) =>
  selectHiddenState(state)[flag];

export const selectStress = (state: { player: { stats?: { stress?: number } } }) =>
  clampStress(state.player?.stats?.stress ?? 20);

export const selectStressBand = (state: { player: { stats?: { stress?: number } } }) =>
  getStressBand(selectStress(state));

export const selectInGameMinutes = (state: { player: { gameTime?: GameTime } }) =>
  selectCurrentGameMinutes(state);

