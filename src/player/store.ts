import { PlayerState, PlayerProfile, PersonalEvent, GameNotification } from './types';
import { GameTime, createInitialGameTime, calculateGameMinutes, GAME_TIME_TICK, GAME_TIME_SET_DAY, GAME_TIME_SET_MINUTES, GAME_TIME_PAUSE, GAME_TIME_RESUME, GAME_TIME_RESET, GAME_TIME_BLOCK_DIALOGUE, GAME_TIME_UNBLOCK_DIALOGUE, GAME_DAY_END_MINUTES } from './gameTime';
import { HiddenState, createInitialHiddenState, SET_HIDDEN_FLAG, SET_MULTIPLE_HIDDEN_FLAGS, INCREMENT_ATLAS_AWARENESS, RESET_HIDDEN_STATE } from './hiddenState';
import { DialogueState, createInitialDialogueState, SET_ACTIVE_DIALOGUE, ADD_RESOLVED_DIALOGUE, CLEAR_DIALOGUE_HISTORY } from './dialogueStore';
import { EventSchedulerState, EVENT_FIRED, RESET_EVENTS, mondayEvents, tuesdayEvents } from './events';

// Action types
export const PLAYER_SET_PROFILE = 'PLAYER_SET_PROFILE';
export const PLAYER_UPDATE_DISPLAY_NAME = 'PLAYER_UPDATE_DISPLAY_NAME';
export const PLAYER_UPDATE_STATS = 'PLAYER_UPDATE_STATS';
export const PLAYER_DISMISS_EVENT = 'PLAYER_DISMISS_EVENT';
export const PLAYER_COMPLETE_FIRST_LAUNCH = 'PLAYER_COMPLETE_FIRST_LAUNCH';

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
): PlayerState => ({
  displayName,
  stats: {
    stress: 35,
    energy: 70,
    salary,
    performanceScore: 60,
    reputation: npcIds.map(npcId => ({
      npcId,
      score: npcId === 'rosa' ? 55 : npcId === 'tom' ? 60 : 50
    }))
  },
  personalEvents,
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
  // Event scheduler
  events: {
    events: [...mondayEvents, ...tuesdayEvents],
    suspendedEventIds: []
  },
  // Day summary overlay
  daySummary: null,
  // Constrained document editor state
  constrainedDocument: null as {
    id: string;
    title: string;
    fields: Array<{
      id: string;
      label: string;
      type: 'dropdown' | 'bullet_list' | 'freetext';
      options?: string[];
      maxItems?: number;
      maxLength?: number;
      placeholder?: string;
      value: string | string[];
    }>;
  } | null,
  // Terminal state for ExecuTerm
  terminal: {
    pendingCommand: null,
    outputLines: []
  }
});

// Default Meridian initial state
export const getMeridianInitialState = (): PlayerState =>
  createInitialPlayerState(
    '', // Set at first launch
    24000,
    'meridian-infrastructure-services-v1',
    ['nathaniel', 'claire', 'james', 'harry', 'rosa', 'tom', 'diane', 'sandra'],
    [
      { id: 'rent', label: 'Rent due Friday — £650', severity: 'warning', dayOffset: 4, dismissed: false },
      { id: 'dentist', label: 'Dentist appointment Thursday 12:30', severity: 'info', dayOffset: 3, dismissed: false },
      { id: 'phone', label: 'Phone contract renewal overdue', severity: 'urgent', dayOffset: 0, dismissed: false }
    ]
  );

const STORAGE_KEY = 'mis_save_v1';
const SAVE_VERSION = 1;

// Load from localStorage
const loadPlayerState = (): PlayerState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check version - discard if mismatch
      if (parsed.version !== undefined && parsed.version !== SAVE_VERSION) {
        console.log('Save version mismatch, discarding old save');
        localStorage.removeItem(STORAGE_KEY);
        return null;
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
  const saved = loadPlayerState();
  const defaults = getMeridianInitialState();
  if (saved) {
    // Merge saved state with defaults to ensure all fields exist
    // Reset events to defaults (unfired) so narrative can replay
    return {
      ...defaults,
      ...saved,
      stats: { ...defaults.stats, ...saved.stats },
      gameTime: { ...defaults.gameTime, ...saved.gameTime },
      hiddenState: { ...defaults.hiddenState, ...saved.hiddenState },
      dialogue: { ...defaults.dialogue, ...saved.dialogue },
      events: defaults.events,  // Reset events to unfired state
      flackDMs: defaults.flackDMs  // Reset DM messages
    };
  }
  return defaults;
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
  'PAUSE_GAME_TIME',
  'RESUME_GAME_TIME'
];

export const createPersistenceMiddleware = () => (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Check if this action should trigger a save
  if (SAVE_TRIGGER_ACTIONS.includes(action.type)) {
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for debounced save
    saveTimeout = setTimeout(() => {
      const state = store.getState();
      const playerState = state.player;
      
      if (playerState) {
        const saveData: PlayerState = {
          displayName: playerState.displayName,
          stats: playerState.stats,
          personalEvents: playerState.personalEvents,
          currentScenarioId: playerState.currentScenarioId,
          firstLaunchComplete: playerState.firstLaunchComplete,
          notifications: playerState.notifications,
          gameTime: playerState.gameTime,
          hiddenState: playerState.hiddenState,
          dialogue: playerState.dialogue,
          flackDMs: playerState.flackDMs,
          events: playerState.events,
          daySummary: playerState.daySummary,
          constrainedDocument: playerState.constrainedDocument,
          terminal: playerState.terminal
        };
        
        savePlayerState(saveData);
        store.dispatch({ type: SAVE_COMPLETED });
      }
    }, SAVE_DEBOUNCE_MS);
  }
  
  return result;
};

// Reducer
export const playerReducer = (state: PlayerState = getInitialState(), action: any): PlayerState => {
  let newState: PlayerState;

  switch (action.type) {
    case PLAYER_RESET_GAME:
      // Return fresh initial state (localStorage already cleared by action creator)
      newState = getMeridianInitialState();
      break;

    case PLAYER_SET_PROFILE:
      newState = {
        ...state,
        ...action.payload
      };
      break;

    case PLAYER_UPDATE_DISPLAY_NAME:
      newState = {
        ...state,
        displayName: action.payload
      };
      break;

    case PLAYER_UPDATE_STATS:
      newState = {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };
      break;

    case PLAYER_DISMISS_EVENT:
      newState = {
        ...state,
        personalEvents: state.personalEvents.map(e =>
          e.id === action.payload ? { ...e, dismissed: true } : e
        )
      };
      break;

    case PLAYER_COMPLETE_FIRST_LAUNCH:
      newState = {
        ...state,
        firstLaunchComplete: true
      };
      break;

    case NOTIFICATION_ADD:
      newState = {
        ...state,
        notifications: {
          ...state.notifications,
          history: [action.payload, ...state.notifications.history],
          unreadCount: state.notifications.unreadCount + 1
        }
      };
      break;

    case NOTIFICATION_MARK_READ:
      newState = {
        ...state,
        notifications: {
          ...state.notifications,
          history: state.notifications.history.map(n =>
            n.id === action.payload ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - (state.notifications.history.find(n => n.id === action.payload)?.read ? 0 : 1))
        }
      };
      break;

    case NOTIFICATION_MARK_ALL_READ:
      newState = {
        ...state,
        notifications: {
          ...state.notifications,
          history: state.notifications.history.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }
      };
      break;

    case NOTIFICATION_CLEAR:
      newState = {
        ...state,
        notifications: {
          ...state.notifications,
          history: [],
          unreadCount: 0
        }
      };
      break;

    case NOTIFICATION_REGISTER_TRIGGER:
      newState = {
        ...state,
        notifications: {
          ...state.notifications,
          firedTriggerIds: [...state.notifications.firedTriggerIds, action.payload]
        }
      };
      break;

    // Game Time actions - Ticker-derived system
    case GAME_TIME_TICK:
      // Calculate current game minutes based on elapsed real time
      const nowMs = action.payload.nowMs;
      const calculatedMinutes = calculateGameMinutes(
        state.gameTime.sessionStartRealMs,
        state.gameTime.sessionStartGameMinutes,
        nowMs,
        state.gameTime.totalPausedMs,
        state.gameTime.compressionRatio,
        state.gameTime.dialogueBlocked
      );
      
      // Cap at end of day
      const cappedMinutes = Math.min(calculatedMinutes, GAME_DAY_END_MINUTES);
      const atEndOfDay = cappedMinutes >= GAME_DAY_END_MINUTES;

      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          currentGameMinutes: cappedMinutes,
          // Auto-pause at end of day
          isPaused: atEndOfDay ? true : state.gameTime.isPaused
        }
      };
      break;

    case GAME_TIME_SET_DAY:
      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
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
        ...state,
        gameTime: {
          ...state.gameTime,
          sessionStartRealMs: Date.now(),
          sessionStartGameMinutes: action.payload,
          currentGameMinutes: action.payload
        }
      };
      break;

    case GAME_TIME_PAUSE:
      // Record when pause started
      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          isPaused: true,
          pauseStartTimeMs: action.payload.nowMs
        }
      };
      break;

    case GAME_TIME_RESUME:
      // Calculate and add to total paused time
      const pauseEndMs = action.payload.nowMs;
      const pauseDuration = state.gameTime.pauseStartTimeMs 
        ? pauseEndMs - state.gameTime.pauseStartTimeMs 
        : 0;
      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          isPaused: false,
          pauseStartTimeMs: null,
          totalPausedMs: state.gameTime.totalPausedMs + pauseDuration
        }
      };
      break;

    case GAME_TIME_BLOCK_DIALOGUE:
      // Pause time advancement during dialogue choices (ticker continues, minutes don't advance)
      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          dialogueBlocked: true
        }
      };
      break;

    case GAME_TIME_UNBLOCK_DIALOGUE:
      // Resume time advancement after dialogue resolved
      newState = {
        ...state,
        gameTime: {
          ...state.gameTime,
          dialogueBlocked: false
        }
      };
      break;

    case GAME_TIME_RESET:
      newState = {
        ...state,
        gameTime: createInitialGameTime()
      };
      break;

    // Hidden State actions
    case SET_HIDDEN_FLAG:
      newState = {
        ...state,
        hiddenState: {
          ...state.hiddenState,
          [action.payload.key]: action.payload.value
        }
      };
      break;

    case SET_MULTIPLE_HIDDEN_FLAGS:
      newState = {
        ...state,
        hiddenState: {
          ...state.hiddenState,
          ...action.payload
        }
      };
      break;

    case INCREMENT_ATLAS_AWARENESS:
      newState = {
        ...state,
        hiddenState: {
          ...state.hiddenState,
          atlasAwareness: Math.min(3, (state.hiddenState?.atlasAwareness || 0) + 1)
        }
      };
      break;

    case RESET_HIDDEN_STATE:
      newState = {
        ...state,
        hiddenState: createInitialHiddenState()
      };
      break;

    // Dialogue State actions
    case SET_ACTIVE_DIALOGUE:
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          activeDialogue: action.payload
        }
      };
      break;

    // DialogueChoice actions
    case 'SET_ACTIVE_CHOICE':
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          activeChoice: action.payload
        }
      };
      break;

    case 'RESOLVE_CHOICE':
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          activeChoice: state.dialogue?.activeChoice
            ? { ...state.dialogue.activeChoice, resolvedOptionId: action.payload.optionId }
            : null
        }
      };
      break;

    case 'ADD_RESOLVED_CHOICE':
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          resolvedChoices: [...(state.dialogue?.resolvedChoices || []), action.payload]
        }
      };
      break;

    case 'CLEAR_CHOICE_HISTORY':
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          activeChoice: null,
          resolvedChoices: []
        }
      };
      break;

    // ExecuTerm actions
    case TERMINAL_EXEC:
      newState = {
        ...state,
        terminal: {
          ...state.terminal,
          pendingCommand: action.payload
        }
      };
      break;

    case TERMINAL_OUTPUT:
      newState = {
        ...state,
        terminal: {
          ...state.terminal,
          outputLines: [
            ...state.terminal.outputLines,
            { type: 'output', text: action.payload }
          ]
        }
      };
      break;

    case TERMINAL_CLEAR:
      newState = {
        ...state,
        terminal: {
          pendingCommand: null,
          outputLines: []
        }
      };
      break;

    case ADD_RESOLVED_DIALOGUE:
      newState = {
        ...state,
        dialogue: {
          ...state.dialogue,
          resolvedDialogues: [...(state.dialogue?.resolvedDialogues || []), action.payload]
        }
      };
      break;

    case CLEAR_DIALOGUE_HISTORY:
      newState = {
        ...state,
        dialogue: createInitialDialogueState()
      };
      break;

    // Event Scheduler actions
    case EVENT_FIRED:
      newState = {
        ...state,
        events: {
          ...state.events,
          events: state.events?.events?.map(e =>
            e.id === action.payload ? { ...e, fired: true } : e
          ) || []
        }
      };
      break;

    case RESET_EVENTS:
      newState = {
        ...state,
        events: {
          events: [...mondayEvents, ...tuesdayEvents],
          suspendedEventIds: []
        }
      };
      break;

    // Day Summary actions
    case 'SHOW_DAY_SUMMARY':
      newState = {
        ...state,
        daySummary: action.payload
      };
      break;

    case 'HIDE_DAY_SUMMARY':
      newState = {
        ...state,
        daySummary: null
      };
      break;

    // Constrained Document actions
    case 'SYNERGY_ENABLE_DOCUMENT':
      newState = {
        ...state,
        constrainedDocument: {
          id: action.payload.id,
          title: action.payload.title,
          fields: action.payload.fields.map((f: any) => ({ ...f, value: f.value || (f.type === 'bullet_list' ? [] : '') }))
        }
      };
      break;

    case 'CLOSE_CONSTRAINED_DOCUMENT':
      newState = {
        ...state,
        constrainedDocument: null
      };
      break;

    // Flack DM actions
    case 'FLACK_ADD_DM_MESSAGE':
      const { participantId, message } = action.payload;
      newState = {
        ...state,
        flackDMs: {
          ...state.flackDMs,
          [participantId]: [...(state.flackDMs[participantId] || []), message]
        }
      };
      break;

    default:
      return state;
  }

  // Persist to localStorage
  savePlayerState(newState);
  return newState;
};

// Selectors for use with useSelector
export const selectPlayer = (state: { player: PlayerState }) => state.player;
export const selectPlayerName = (state: { player: PlayerState }) => state.player.displayName;
export const selectPlayerStats = (state: { player: PlayerState }) => state.player.stats;
export const selectPersonalEvents = (state: { player: PlayerState }) =>
  state.player.personalEvents.filter(e => !e.dismissed);
export const selectIsFirstLaunch = (state: { player: PlayerState }) =>
  !state.player.firstLaunchComplete || !state.player.displayName;

export const selectNotifications = (state: { player: PlayerState }) =>
  state.player?.notifications ?? { history: [], unreadCount: 0, firedTriggerIds: [] };

export const selectUnreadCount = (state: { player: PlayerState }) =>
  state.player?.notifications?.unreadCount ?? 0;

export const selectNotificationHistory = (state: { player: PlayerState }) =>
  state.player?.notifications?.history ?? [];

export const selectFiredTriggers = (state: { player: PlayerState }) =>
  state.player?.notifications?.firedTriggerIds ?? [];

// Flack selectors
export const selectFlackDMs = (state: { player: PlayerState }) =>
  state.player?.flackDMs ?? {};

// Reputation selector
export const selectReputation = (state: { player: PlayerState }) =>
  state.player?.stats?.reputation ?? [];

// Re-export game time selectors for convenience
export { selectGameTime } from './gameTime';

// Save game selectors
export const selectSaveGameInfo = (state: { player: PlayerState }) => ({
  hasSave: hasSavedGame(),
  day: state.player?.gameTime?.currentDay ?? 1,
  gameTime: state.player?.gameTime?.currentGameMinutes ?? 0,
  playerName: state.player?.displayName || 'Unknown'
});
