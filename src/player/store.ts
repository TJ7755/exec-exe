import { PlayerState, PlayerProfile, PersonalEvent, GameNotification, SmallTalkHistory } from './types';
import { GameTime, createInitialGameTime, calculateGameMinutes, GAME_TIME_TICK, GAME_TIME_SET_DAY, GAME_TIME_SET_MINUTES, GAME_TIME_PAUSE, GAME_TIME_RESUME, GAME_TIME_RESET, GAME_TIME_BLOCK_DIALOGUE, GAME_TIME_UNBLOCK_DIALOGUE, GAME_DAY_END_MINUTES } from './gameTime';
import { HiddenState, createInitialHiddenState, SET_HIDDEN_FLAG, SET_MULTIPLE_HIDDEN_FLAGS, INCREMENT_ATLAS_AWARENESS, RESET_HIDDEN_STATE } from './hiddenState';
import { DialogueState, createInitialDialogueState, SET_ACTIVE_DIALOGUE, ADD_RESOLVED_DIALOGUE, CLEAR_DIALOGUE_HISTORY } from './dialogueStore';
import { EventSchedulerState, EVENT_FIRED, RESET_EVENTS } from './events';

// Action types
export const PLAYER_SET_PROFILE = 'PLAYER_SET_PROFILE';
export const PLAYER_UPDATE_DISPLAY_NAME = 'PLAYER_UPDATE_DISPLAY_NAME';
export const PLAYER_UPDATE_STATS = 'PLAYER_UPDATE_STATS';
export const PLAYER_DISMISS_EVENT = 'PLAYER_DISMISS_EVENT';
export const PLAYER_COMPLETE_FIRST_LAUNCH = 'PLAYER_COMPLETE_FIRST_LAUNCH';
export const SMALL_TALK_QUESTION_ASKED = 'SMALL_TALK_QUESTION_ASKED';

// Notification action types
export const NOTIFICATION_ADD = 'NOTIFICATION_ADD';
export const NOTIFICATION_MARK_READ = 'NOTIFICATION_MARK_READ';
export const NOTIFICATION_MARK_ALL_READ = 'NOTIFICATION_MARK_ALL_READ';
export const NOTIFICATION_CLEAR = 'NOTIFICATION_CLEAR';
export const NOTIFICATION_REGISTER_TRIGGER = 'NOTIFICATION_REGISTER_TRIGGER';

// ExecuTerm action types
export const TERMINAL_EXEC = 'TERMINAL_EXEC';
export const TERMINAL_OUTPUT = 'TERMINAL_OUTPUT';
export const TERMINAL_CLEAR = 'TERMINAL_CLEAR';

// Initial state factory - creates fresh state for a scenario
export const createInitialPlayerState = (
  displayName: string,
  salary: number,
  scenarioId: string,
  npcIds: string[],
  personalEvents: PersonalEvent[]
): PlayerState => {
  // Ensure npcIds and personalEvents are arrays
  const safeNpcIds = Array.isArray(npcIds) ? npcIds : [];
  const safePersonalEvents = Array.isArray(personalEvents) ? personalEvents : [];

  // Additional safety: ensure no primitive values in arrays
  if (typeof safeNpcIds !== 'object' || safeNpcIds === null) {
    console.error('[createInitialPlayerState] safeNpcIds is not an object:', safeNpcIds);
  }
  if (typeof safePersonalEvents !== 'object' || safePersonalEvents === null) {
    console.error('[createInitialPlayerState] safePersonalEvents is not an object:', safePersonalEvents);
  }

  // Defensive check: ensure safeNpcIds is an array before mapping
  const safeNpcIdsArray = Array.isArray(safeNpcIds) ? safeNpcIds : [];
  if (!Array.isArray(safeNpcIds)) {
    console.error('[createInitialPlayerState] safeNpcIds is not an array, using empty array:', safeNpcIds);
  }

  return {
    displayName,
    stats: {
      stress: 35,
      energy: 70,
      salary,
      performanceScore: 60,
      reputation: safeNpcIdsArray.map(npcId => ({
        npcId,
        score: npcId === 'rosa' ? 55 : npcId === 'tom' ? 60 : 50
      }))
    },
    personalEvents: safePersonalEvents,
    currentScenarioId: scenarioId,
    firstLaunchComplete: false,
    notifications: {
      history: [],
      unreadCount: 0,
      firedTriggerIds: []
    },
    // Game time system
    gameTime: createInitialGameTime(),
    // Hidden state (consequence engine)
    hiddenState: createInitialHiddenState(),
    // Dialogue state
    dialogue: createInitialDialogueState(),
    // Flack DM messages (from event system)
    flackDMs: {},
    // Flack channel messages (from event system)
    flackChannels: {},
    // Event scheduler
    events: {
      events: [],
      suspendedEventIds: []
    },
    // Day summary overlay
    daySummary: null,
    // Constrained document editor state
    constrainedDocument: null,
    // Terminal state for ExecuTerm
    terminal: {
      pendingCommand: null,
      outputLines: []
    },
    // Small talk history (tracks which questions have been asked)
    smallTalkHistory: {}
  };
}

// Default Meridian initial state
export const getMeridianInitialState = (): PlayerState => {
  const npcIds = ['nathaniel', 'claire', 'james', 'harry', 'rosa', 'tom', 'diane'];
  const personalEvents = [
    { id: 'rent', label: 'Rent due Friday — £650', severity: 'warning' as const, dayOffset: 4, dismissed: false },
    { id: 'dentist', label: 'Dentist appointment Thursday 12:30', severity: 'info' as const, dayOffset: 3, dismissed: false },
    { id: 'phone', label: 'Phone contract renewal overdue', severity: 'urgent' as const, dayOffset: 0, dismissed: false }
  ];
  
  try {
    return createInitialPlayerState(
      '', // Set at first launch
      24000,
      'meridian-infrastructure-services-v1',
      npcIds,
      personalEvents
    );
  } catch (e) {
    console.error('[getMeridianInitialState] Failed to create initial state:', e);
    // Return a minimal safe state
    return createInitialPlayerState('', 24000, 'meridian-infrastructure-services-v1', [], []);
  }
};

const STORAGE_KEY = 'mis_save_v1';
const SAVE_VERSION = 1;

// Load from localStorage
const loadPlayerState = (): PlayerState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that parsed is an object before using it
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn('Invalid save data format, discarding:', parsed);
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      // Check version - discard if mismatch
      if (parsed.version !== undefined && parsed.version !== SAVE_VERSION) {
        console.log('Save version mismatch, discarding old save');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      // Defensive check: ensure all nested arrays are actually arrays
      if (!Array.isArray(parsed.stats?.reputation)) {
        console.warn('[loadPlayerState] reputation is not an array, resetting');
        parsed.stats = parsed.stats || {};
        parsed.stats.reputation = [];
      }
      if (!Array.isArray(parsed.personalEvents)) {
        console.warn('[loadPlayerState] personalEvents is not an array, resetting');
        parsed.personalEvents = [];
      }
      if (!Array.isArray(parsed.notifications?.history)) {
        console.warn('[loadPlayerState] notifications.history is not an array, resetting');
        parsed.notifications = parsed.notifications || {};
        parsed.notifications.history = [];
      }
      if (!Array.isArray(parsed.notifications?.firedTriggerIds)) {
        console.warn('[loadPlayerState] notifications.firedTriggerIds is not an array, resetting');
        parsed.notifications = parsed.notifications || {};
        parsed.notifications.firedTriggerIds = [];
      }
      if (!Array.isArray(parsed.events?.events)) {
        console.warn('[loadPlayerState] events.events is not an array, resetting');
        parsed.events = parsed.events || {};
        parsed.events.events = [];
      }
      if (!Array.isArray(parsed.events?.suspendedEventIds)) {
        console.warn('[loadPlayerState] events.suspendedEventIds is not an array, resetting');
        parsed.events = parsed.events || {};
        parsed.events.suspendedEventIds = [];
      }
      if (!Array.isArray(parsed.terminal?.outputLines)) {
        console.warn('[loadPlayerState] terminal.outputLines is not an array, resetting');
        parsed.terminal = parsed.terminal || {};
        parsed.terminal.outputLines = [];
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load player state:', e);
  }
  return null;
};

// Save to localStorage
const savePlayerState = (state: PlayerState): void => {
  try {
    const saveData = {
      ...state,
      version: SAVE_VERSION,
      savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.error('Failed to save player state:', e);
  }
};

// Check if there's a saved game
export const hasSavedGame = (): boolean => {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return false;
  }
};

// Clear saved game (for reset)
export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear player state:', e);
  }
};

// Action types for reset
export const PLAYER_RESET_GAME = 'PLAYER_RESET_GAME';

// Get initial state (from storage or create fresh)
export const getInitialState = (): PlayerState => {
  try {
    const saved = loadPlayerState();
    const defaults = getMeridianInitialState();
    // Defensive check: ensure saved is an object and not an array
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      // Merge saved state with defaults to ensure all fields exist
      // Reset events to defaults (unfired) so narrative can replay
      // IMPORTANT: Reset sessionStartRealMs to current time to fix time calculation
      // This preserves the saved game time position but resets the session baseline
      const currentGameMinutes = saved.gameTime?.currentGameMinutes ?? 0;

      // Ensure stats.reputation is an array
      const savedReputation = saved.stats?.reputation;
      const safeReputation = Array.isArray(savedReputation) ? savedReputation : defaults.stats.reputation;

      // Ensure firedTriggerIds is an array
      const savedFiredTriggers = saved.notifications?.firedTriggerIds;
      const safeFiredTriggers = Array.isArray(savedFiredTriggers) ? savedFiredTriggers : [];

      // Defensive check: ensure saved.stats is an object before spreading
      const safeSavedStats = (typeof saved.stats === 'object' && saved.stats !== null && !Array.isArray(saved.stats)) ? saved.stats : {};

      // Defensive check: ensure saved.gameTime is an object before spreading
      const safeSavedGameTime = (typeof saved.gameTime === 'object' && saved.gameTime !== null && !Array.isArray(saved.gameTime)) ? saved.gameTime : {};

      // Defensive check: ensure saved.hiddenState is an object before spreading
      const safeSavedHiddenState = (typeof saved.hiddenState === 'object' && saved.hiddenState !== null && !Array.isArray(saved.hiddenState)) ? saved.hiddenState : {};

      // Defensive check: ensure saved.dialogue is an object before spreading
      const safeSavedDialogue = (typeof saved.dialogue === 'object' && saved.dialogue !== null && !Array.isArray(saved.dialogue)) ? saved.dialogue : {};

      // Defensive check: ensure saved.notifications is an object before spreading
      const safeSavedNotifications = (typeof saved.notifications === 'object' && saved.notifications !== null && !Array.isArray(saved.notifications)) ? saved.notifications : {};

      return {
        ...defaults,
        stats: {
          ...defaults.stats,
          ...safeSavedStats,
          reputation: safeReputation
        },
        gameTime: {
          ...defaults.gameTime,
          ...safeSavedGameTime,
          sessionStartRealMs: Date.now(),
          sessionStartGameMinutes: currentGameMinutes,
          pauseStartTimeMs: null,
          totalPausedMs: 0,
          isPaused: false,
        },
        hiddenState: { ...defaults.hiddenState, ...safeSavedHiddenState },
        dialogue: { ...defaults.dialogue, ...safeSavedDialogue },
        events: defaults.events,  // Reset events to unfired state
        flackDMs: defaults.flackDMs,  // Reset DM messages
        flackChannels: defaults.flackChannels, // Reset channel messages
        notifications: {
          ...defaults.notifications,
          ...safeSavedNotifications,
          firedTriggerIds: safeFiredTriggers
        },
        // Only copy specific fields from saved to avoid spreading corrupted data
        displayName: saved.displayName || defaults.displayName,
        currentScenarioId: saved.currentScenarioId || defaults.currentScenarioId,
        firstLaunchComplete: typeof saved.firstLaunchComplete === 'boolean' ? saved.firstLaunchComplete : defaults.firstLaunchComplete,
        daySummary: saved.daySummary || defaults.daySummary,
        constrainedDocument: saved.constrainedDocument || defaults.constrainedDocument,
        smallTalkHistory: (typeof saved.smallTalkHistory === 'object' && saved.smallTalkHistory !== null && !Array.isArray(saved.smallTalkHistory)) ? saved.smallTalkHistory : defaults.smallTalkHistory
      };
    }
    return defaults;
  } catch (e) {
    console.error('[getInitialState] Failed to get initial state:', e);
    return getMeridianInitialState();
  }
};

// Action creators
export const setPlayerProfile = (profile: PlayerProfile) => ({
  type: PLAYER_SET_PROFILE,
  payload: profile
});

export const updateDisplayName = (name: string) => ({
  type: PLAYER_UPDATE_DISPLAY_NAME,
  payload: name
});

export const updateStats = (stats: Partial<PlayerState['stats']>) => ({
  type: PLAYER_UPDATE_STATS,
  payload: stats
});

export const dismissEvent = (eventId: string) => ({
  type: PLAYER_DISMISS_EVENT,
  payload: eventId
});

export const completeFirstLaunch = () => ({
  type: PLAYER_COMPLETE_FIRST_LAUNCH
});

// Reset game action - clears save and returns to initial state
export const resetGame = () => {
  clearSavedGame();
  return {
    type: PLAYER_RESET_GAME
  };
};

// Small talk action creator
export const recordSmallTalkQuestion = (npcId: string, questionId: string) => ({
  type: SMALL_TALK_QUESTION_ASKED,
  payload: { npcId, questionId }
});

// Notification action creators
export const addNotification = (notification: Omit<GameNotification, 'id' | 'timestamp' | 'read'>) => ({
  type: NOTIFICATION_ADD,
  payload: {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    read: false
  }
});

export const markNotificationRead = (notificationId: string) => ({
  type: NOTIFICATION_MARK_READ,
  payload: notificationId
});

export const markAllNotificationsRead = () => ({
  type: NOTIFICATION_MARK_ALL_READ
});

export const clearNotifications = () => ({
  type: NOTIFICATION_CLEAR
});

export const registerNotificationTrigger = (triggerId: string) => ({
  type: NOTIFICATION_REGISTER_TRIGGER,
  payload: triggerId
});

// Save completed action (for auto-save indicator)
export const SAVE_COMPLETED = 'SAVE_COMPLETED';

// Persistence middleware - debounced saves to localStorage
const SAVE_DEBOUNCE_MS = 500;
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Actions that trigger a save
const SAVE_TRIGGER_ACTIONS = [
  'DIALOGUE_CHOICE_RESOLVED',
  'RESOLVE_CHOICE',
  'SEND_EMAIL',
  'ADD_EMAIL',
  'DAY_SUMMARY_ADVANCE',
  'GAME_TIME_SET_DAY',
  'SET_HIDDEN_FLAG',
  'SET_MULTIPLE_HIDDEN_FLAGS',
  'ADD_RESOLVED_CHOICE',
  'FLACK_ADD_DM_MESSAGE',
  'FLACK_ADD_MESSAGE',
  GAME_TIME_PAUSE,
  GAME_TIME_RESUME
];

export const createPersistenceMiddleware = () => (store: any) => (next: any) => (action: any) => {
  try {
    const result = next(action);

    // Check if this action should trigger a save
    if (SAVE_TRIGGER_ACTIONS.includes(action.type)) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for debounced save
      saveTimeout = setTimeout(() => {
        try {
          const state = store.getState();
          const playerState = state.player;

          if (playerState && typeof playerState === 'object') {
            // Validate arrays before saving
            const safePersonalEvents = Array.isArray(playerState.personalEvents) ? playerState.personalEvents : [];
            const safeReputation = Array.isArray(playerState.stats?.reputation) ? playerState.stats.reputation : [];

            // Defensive check: ensure stats is an object before spreading
            const safeStats = (typeof playerState.stats === 'object' && playerState.stats !== null && !Array.isArray(playerState.stats))
              ? playerState.stats
              : { stress: 35, energy: 70, salary: 24000, performanceScore: 60, reputation: safeReputation };

            const saveData: PlayerState = {
              displayName: playerState.displayName || '',
              stats: safeStats,
              personalEvents: safePersonalEvents,
              currentScenarioId: playerState.currentScenarioId || '',
              firstLaunchComplete: !!playerState.firstLaunchComplete,
              notifications: playerState.notifications || { history: [], unreadCount: 0, firedTriggerIds: [] },
              gameTime: playerState.gameTime || createInitialGameTime(),
              hiddenState: playerState.hiddenState || {},
              dialogue: playerState.dialogue || {},
              flackDMs: playerState.flackDMs || {},
              flackChannels: playerState.flackChannels || {},
              events: playerState.events || {},
              daySummary: playerState.daySummary || null,
              constrainedDocument: playerState.constrainedDocument || null,
              terminal: playerState.terminal || { outputLines: [] },
              smallTalkHistory: playerState.smallTalkHistory || {}
            };

            savePlayerState(saveData);
            store.dispatch({ type: SAVE_COMPLETED });
          }
        } catch (e) {
          console.error('[createPersistenceMiddleware] Save error:', e);
        }
      }, SAVE_DEBOUNCE_MS);
    }

    return result;
  } catch (e) {
    console.error('[createPersistenceMiddleware] Error:', e);
    return next(action);
  }
};

// Reducer
export const playerReducer = (state: PlayerState = getInitialState(), action: any): PlayerState => {
  try {
    // Defensive check: ensure state is a valid object
    const safeState = (state && typeof state === 'object' && !Array.isArray(state)) ? state : getInitialState();
    let newState: PlayerState;

    switch (action.type) {
    case PLAYER_RESET_GAME:
      // Return fresh initial state (localStorage already cleared by action creator)
      newState = getMeridianInitialState();
      break;

    case PLAYER_SET_PROFILE:
      // Defensive check: ensure action.payload is an object before spreading
      if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
        newState = {
          ...safeState,
          ...action.payload
        };
      } else {
        console.warn('[playerReducer] PLAYER_SET_PROFILE payload is not an object:', action.payload);
        newState = safeState;
      }
      break;

    case PLAYER_UPDATE_DISPLAY_NAME:
      newState = {
        ...safeState,
        displayName: action.payload
      };
      break;

    case PLAYER_UPDATE_STATS:
      // Merge stats carefully. Reputation updates are treated as deltas
      // (array of { npcId, score }) and should be merged into existing
      // reputation entries rather than replacing the entire array.
      {
        const payload = action.payload || {};
        const { reputation: reputationPayload, ...otherStats } = payload as any;

        let mergedReputation = Array.isArray(safeState.stats.reputation) ? safeState.stats.reputation : [];

        if (Array.isArray(reputationPayload)) {
          // Apply deltas to existing reputation entries
          const repMap: Record<string, number> = {};
          mergedReputation.forEach(r => { repMap[r.npcId] = r.score; });

          reputationPayload.forEach((p: any) => {
            if (!p || typeof p.npcId !== 'string') return;
            const prev = repMap[p.npcId] ?? 0;
            repMap[p.npcId] = prev + (Number(p.score) || 0);
          });

          // Reconstruct array preserving original ordering where possible
          mergedReputation = mergedReputation.map(r => ({ npcId: r.npcId, score: repMap[r.npcId] ?? r.score }));
          // Append any new NPCs that didn't exist before
          Object.keys(repMap).forEach(npcId => {
            if (!mergedReputation.find(r => r.npcId === npcId)) {
              mergedReputation.push({ npcId, score: repMap[npcId] });
            }
          });
        }

        newState = {
          ...safeState,
          stats: {
            ...safeState.stats,
            ...otherStats,
            reputation: mergedReputation
          }
        };
      }
      break;

    case PLAYER_DISMISS_EVENT:
      newState = {
        ...safeState,
        personalEvents: Array.isArray(safeState.personalEvents) ? safeState.personalEvents.map(e =>
          e.id === action.payload ? { ...e, dismissed: true } : e
        ) : []
      };
      break;

    case PLAYER_COMPLETE_FIRST_LAUNCH:
      newState = {
        ...safeState,
        firstLaunchComplete: true
      };
      break;

    case NOTIFICATION_ADD:
      newState = {
        ...safeState,
        notifications: {
          ...safeState.notifications,
          history: [action.payload, ...safeState.notifications.history],
          unreadCount: safeState.notifications.unreadCount + 1
        }
      };
      break;

    case NOTIFICATION_MARK_READ:
      newState = {
        ...safeState,
        notifications: {
          ...safeState.notifications,
          history: safeState.notifications.history.map(n =>
            n.id === action.payload ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, safeState.notifications.unreadCount - (safeState.notifications.history.find(n => n.id === action.payload)?.read ? 0 : 1))
        }
      };
      break;

    case NOTIFICATION_MARK_ALL_READ:
      newState = {
        ...safeState,
        notifications: {
          ...safeState.notifications,
          history: safeState.notifications.history.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }
      };
      break;

    case NOTIFICATION_CLEAR:
      newState = {
        ...safeState,
        notifications: {
          ...safeState.notifications,
          history: [],
          unreadCount: 0
        }
      };
      break;

    case NOTIFICATION_REGISTER_TRIGGER:
      const currentFiredTriggers = Array.isArray(safeState.notifications?.firedTriggerIds)
        ? safeState.notifications.firedTriggerIds
        : [];
      newState = {
        ...safeState,
        notifications: {
          ...safeState.notifications,
          firedTriggerIds: [...currentFiredTriggers, action.payload]
        }
      };
      break;

    // Game Time actions - Ticker-derived system
    case GAME_TIME_TICK:
      // Calculate current game minutes based on elapsed real time
      const nowMs = action.payload.nowMs;
      const calculatedMinutes = calculateGameMinutes(
        safeState.gameTime.sessionStartRealMs,
        safeState.gameTime.sessionStartGameMinutes,
        nowMs,
        safeState.gameTime.totalPausedMs,
        safeState.gameTime.compressionRatio,
        safeState.gameTime.dialogueBlocked,
        safeState.gameTime.isPaused
      );
      
      // Cap at end of day
      const cappedMinutes = Math.min(calculatedMinutes, GAME_DAY_END_MINUTES);
      const atEndOfDay = cappedMinutes >= GAME_DAY_END_MINUTES;

      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          currentGameMinutes: cappedMinutes,
          // Auto-pause at end of day
          isPaused: atEndOfDay ? true : safeState.gameTime.isPaused
        }
      };
      break;

    case GAME_TIME_SET_DAY:
      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          currentDay: action.payload,
          // Reset session tracking for new day
          sessionStartRealMs: Date.now(),
          sessionStartGameMinutes: 0,
          currentGameMinutes: 0,
          isPaused: false,
          totalPausedMs: 0,
          pauseStartTimeMs: null
        }
      };
      break;

    case GAME_TIME_SET_MINUTES:
      // Setting minutes directly resets the session baseline
      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          sessionStartRealMs: Date.now(),
          sessionStartGameMinutes: action.payload,
          currentGameMinutes: action.payload
        }
      };
      break;

    case GAME_TIME_PAUSE:
      // Record when pause started
      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          isPaused: true,
          pauseStartTimeMs: action.payload.nowMs
        }
      };
      break;

    case GAME_TIME_RESUME:
      // Calculate and add to total paused time
      const pauseEndMs = action.payload.nowMs;
      const pauseDuration = safeState.gameTime.pauseStartTimeMs
        ? pauseEndMs - safeState.gameTime.pauseStartTimeMs
        : 0;
      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          isPaused: false,
          pauseStartTimeMs: null,
          totalPausedMs: safeState.gameTime.totalPausedMs + pauseDuration
        }
      };
      break;

    case GAME_TIME_BLOCK_DIALOGUE:
      // Pause time advancement during dialogue choices (ticker continues, minutes don't advance)
      // To freeze time correctly, reset the session baseline to the current
      // game minute so calculateGameMinutes returns the frozen minute while
      // `dialogueBlocked` is true.
      newState = {
        ...safeState,
        gameTime: {
          ...safeState.gameTime,
          dialogueBlocked: true,
          sessionStartRealMs: Date.now(),
          sessionStartGameMinutes: safeState.gameTime.currentGameMinutes
        }
      };
      break;

    default:
      return safeState;
  }

  return newState;
  } catch (e) {
    console.error('[playerReducer] Error:', e);
    return getInitialState();
  }
};

// Selectors for use with useSelector
export const selectPlayer = (state: { player: PlayerState }) => {
  // Defensive check: ensure state.player is a valid object
  if (!state.player || typeof state.player !== 'object' || Array.isArray(state.player)) {
    console.error('[selectPlayer] Invalid player state:', state.player);
    return getInitialState();
  }
  return state.player;
};

export const selectPlayerName = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.displayName || '';
};

export const selectPlayerStats = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.stats || { stress: 35, energy: 70, salary: 24000, performanceScore: 60, reputation: [] };
};

export const selectPersonalEvents = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  const events = player?.personalEvents;
  if (!Array.isArray(events)) {
    console.warn('[selectPersonalEvents] personalEvents is not an array:', events);
    return [];
  }
  return events.filter(e => !e.dismissed);
};

export const selectIsFirstLaunch = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return !player.firstLaunchComplete || !player.displayName;
};

export const selectNotifications = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.notifications ?? { history: [], unreadCount: 0, firedTriggerIds: [] };
};

export const selectUnreadCount = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.notifications?.unreadCount ?? 0;
};

export const selectNotificationHistory = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.notifications?.history ?? [];
};

export const selectFiredTriggers = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.notifications?.firedTriggerIds ?? [];
};

// Flack selectors
export const selectFlackDMs = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.flackDMs ?? {};
};

export const selectFlackChannels = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.flackChannels ?? {};
};

// Reputation selector
export const selectReputation = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.stats?.reputation ?? [];
};

// Small talk history selector
export const selectSmallTalkHistory = (state: { player: PlayerState }) => {
  const player = selectPlayer(state);
  return player?.smallTalkHistory ?? {};
};

// Re-export game time selectors for convenience
export { selectGameTime } from './gameTime';

// Save game selectors
export const selectSaveGameInfo = (state: { player: PlayerState }) => ({
  hasSave: hasSavedGame(),
  day: state.player?.gameTime?.currentDay ?? 1,
  gameTime: state.player?.gameTime?.currentGameMinutes ?? 0,
  playerName: state.player?.displayName || 'Unknown'
});
