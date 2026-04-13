/**
 * Game Time System
 * Ticker-derived game minutes with pause support
 * 
 * 1 real second = 7.5 game seconds
 * Game day: 09:00–17:00 = 480 game minutes
 * Compression: 7.5 game seconds per real second = 0.125 game minutes per real second
 * 
 * AI_HOOK: The TICK action is the integration point for AI NPC mood drift.
 */

// Action types
export const GAME_TIME_TICK = 'GAME_TIME_TICK';
export const GAME_TIME_SET_DAY = 'GAME_TIME_SET_DAY';
export const GAME_TIME_SET_MINUTES = 'GAME_TIME_SET_MINUTES';
export const GAME_TIME_PAUSE = 'GAME_TIME_PAUSE';
export const GAME_TIME_RESUME = 'GAME_TIME_RESUME';
export const GAME_TIME_RESET = 'GAME_TIME_RESET';
export const GAME_TIME_SET_COMPRESSION = 'GAME_TIME_SET_COMPRESSION';
export const GAME_TIME_BLOCK_DIALOGUE = 'GAME_TIME_BLOCK_DIALOGUE';
export const GAME_TIME_UNBLOCK_DIALOGUE = 'GAME_TIME_UNBLOCK_DIALOGUE';

export interface GameTime {
  // Session tracking for ticker-derived calculation
  sessionStartRealMs: number;       // Date.now() when session began
  sessionStartGameMinutes: number;  // Game minutes offset at session start (0 = 09:00)
  
  // Cached current values (derived from session start + elapsed real time)
  currentDay: number;               // 1 = Monday, 2 = Tuesday ... 5 = Friday
  currentGameMinutes: number;       // 0–480 (maps to 9:00am–5:00pm)
  
  // Pause states
  isPaused: boolean;                // Manual pause (e.g., menu, end of day)
  dialogueBlocked: boolean;         // Auto-pause during dialogue choices
  pauseStartTimeMs: number | null;  // When pause began (to subtract from elapsed)
  totalPausedMs: number;            // Accumulated paused time to subtract
  
  // Config
  compressionRatio: number;        // default: 7.5 (game seconds per real second)
}

export const DEFAULT_COMPRESSION_RATIO = 7.5;
export const GAME_DAY_START_MINUTES = 0;    // 09:00
export const GAME_DAY_END_MINUTES = 480;    // 17:00

export const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_NAMES_FULL = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Calculate game minutes from elapsed real time
export const calculateGameMinutes = (
  sessionStartRealMs: number,
  sessionStartGameMinutes: number,
  currentRealMs: number,
  totalPausedMs: number,
  compressionRatio: number
): number => {
  const elapsedRealMs = currentRealMs - sessionStartRealMs - totalPausedMs;
  const elapsedRealSeconds = elapsedRealMs / 1000;
  const elapsedGameSeconds = elapsedRealSeconds * compressionRatio;
  const elapsedGameMinutes = elapsedGameSeconds / 60;
  return sessionStartGameMinutes + elapsedGameMinutes;
};

// Initial state factory
export const createInitialGameTime = (): GameTime => ({
  sessionStartRealMs: Date.now(),
  sessionStartGameMinutes: 0,  // Start at 9:00 (minute 0)
  currentDay: 1,
  currentGameMinutes: 0,
  isPaused: false,
  dialogueBlocked: false,
  pauseStartTimeMs: null,
  totalPausedMs: 0,
  compressionRatio: DEFAULT_COMPRESSION_RATIO,
});

// Helper functions for time conversion
export const gameMinutesToGameTime = (minutes: number): string => {
  // Game minutes 0 = 09:00
  const totalMinutesFrom9am = Math.floor(minutes);
  const hours = 9 + Math.floor(totalMinutesFrom9am / 60);
  const mins = totalMinutesFrom9am % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

export const formatRealTime = (date: Date): string => {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

// Action creators
export const tickGameTime = () => ({
  type: GAME_TIME_TICK,
  payload: { nowMs: Date.now() }
});

export const setGameDay = (day: number) => ({
  type: GAME_TIME_SET_DAY,
  payload: day
});

export const setGameMinutes = (minutes: number) => ({
  type: GAME_TIME_SET_MINUTES,
  payload: minutes
});

export const pauseGameTime = () => ({
  type: GAME_TIME_PAUSE,
  payload: { nowMs: Date.now() }
});

export const resumeGameTime = () => ({
  type: GAME_TIME_RESUME,
  payload: { nowMs: Date.now() }
});

export const resetGameTime = () => ({
  type: GAME_TIME_RESET
});

export const advanceToDay = (day: number) => ({
  type: GAME_TIME_SET_DAY,
  payload: day
});

export const endOfDay = () => ({
  type: GAME_TIME_PAUSE,
  payload: { nowMs: Date.now() }
});

export const blockDialogue = () => ({
  type: GAME_TIME_BLOCK_DIALOGUE
});

export const unblockDialogue = () => ({
  type: GAME_TIME_UNBLOCK_DIALOGUE
});

// Selectors
export const selectGameTime = (state: { player: { gameTime?: GameTime } }) => 
  state.player.gameTime ?? createInitialGameTime();

export const selectCurrentDay = (state: { player: { gameTime?: GameTime } }) => 
  state.player.gameTime?.currentDay ?? 1;

export const selectCurrentGameMinutes = (state: { player: { gameTime?: GameTime } }) => 
  state.player.gameTime?.currentGameMinutes ?? 0;

export const selectIsPaused = (state: { player: { gameTime?: GameTime } }) => 
  state.player.gameTime?.isPaused ?? false;

export const selectIsDialogueBlocked = (state: { player: { gameTime?: GameTime } }) => 
  state.player.gameTime?.dialogueBlocked ?? false;

export const selectShouldAdvanceTime = (state: { player: { gameTime?: GameTime } }): boolean => {
  const gameTime = state.player.gameTime ?? createInitialGameTime();
  // Don't advance if manually paused, during dialogue choices, or at end of day
  if (gameTime.isPaused) return false;
  if (gameTime.dialogueBlocked) return false;
  if (gameTime.currentGameMinutes >= GAME_DAY_END_MINUTES) return false;
  return true;
};

export const selectFormattedGameTime = (state: { player: { gameTime?: GameTime } }): string => {
  const gameTime = state.player.gameTime ?? createInitialGameTime();
  // Always show actual game time - lunch break no longer pauses
  return gameMinutesToGameTime(gameTime.currentGameMinutes);
};

export const selectDayName = (state: { player: { gameTime?: GameTime } }): string => {
  const day = state.player.gameTime?.currentDay ?? 1;
  return DAY_NAMES[day] ?? 'Mon';
};

export const selectDayNameFull = (state: { player: { gameTime?: GameTime } }): string => {
  const day = state.player.gameTime?.currentDay ?? 1;
  return DAY_NAMES_FULL[day] ?? 'Monday';
};

// Format game date as DD/MM/YY for taskbar display
// Week 1: Day 1 = 03/03/25, Day 2 = 04/03/25, etc.
export const selectGameDate = (state: { player: { gameTime?: GameTime } }): string => {
  const day = state.player.gameTime?.currentDay ?? 1;
  // March 3, 2025 is a Monday - use this as the starting point
  const dayOfMonth = 2 + day; // Day 1 = 3rd, Day 2 = 4th, etc.
  return `${dayOfMonth.toString().padStart(2, '0')}/03/25`;
};
