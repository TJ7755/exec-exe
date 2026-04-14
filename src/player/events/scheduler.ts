/**
 * Event Scheduler
 * Part 4 — Event Scheduler
 * 
 * The event scheduler runs on every TICK, checking unfired time-triggered events.
 * Fire matching events in order.
 * 
 * AI_HOOK: Game time events will later trigger AI NPC "mood drift" recalculations
 * based on elapsed game time. The TICK action is the integration point.
 */

import { Dispatch, AnyAction } from 'redux';
import { GameEvent, GetState, eventFired } from './types';
import { GAME_TIME_TICK, GameTime, selectGameTime } from '../gameTime';
import { generateAllCalendarEvents } from './calendarEvents';
import { CalendarEntry } from '../../scenarios/types';

// Store reference for the scheduler
let storeDispatch: Dispatch<AnyAction> | null = null;
let storeGetState: GetState | null = null;

// Event registry
let registeredEvents: GameEvent[] = [];

/**
 * Initialize the scheduler with store access
 */
export const initializeScheduler = (
  dispatch: Dispatch<AnyAction>,
  getState: GetState
) => {
  storeDispatch = dispatch;
  storeGetState = getState;
};

/**
 * Register events for the current scenario
 */
export const registerEvents = (events: GameEvent[]) => {
  registeredEvents = events;
};

/**
 * Register calendar events from scenario data
 * Generates pre-event warnings and start notifications for each calendar entry
 */
export const registerCalendarEvents = (calendarEntries: CalendarEntry[]) => {
  const calendarEvents = generateAllCalendarEvents(calendarEntries);
  // Append calendar events to existing registered events
  registeredEvents = [...registeredEvents, ...calendarEvents];
  
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log(`[EventScheduler] Registered ${calendarEvents.length} calendar events from ${calendarEntries.length} entries`);
  }
};

/**
 * Clear all registered events (useful when loading a new scenario)
 */
export const clearRegisteredEvents = () => {
  registeredEvents = [];
  
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log('[EventScheduler] Cleared all registered events');
  }
};

/**
 * Check and fire time-triggered events
 */
export const checkTimeEvents = (
  gameTime: GameTime,
  dispatch: Dispatch<AnyAction>,
  getState: GetState
) => {
  const { currentDay, currentGameMinutes } = gameTime;

  // Find events that should fire
  const eventsToFire = registeredEvents.filter(event => {
    // Skip already fired events
    if (event.fired) return false;

    // Check if event was cancelled by another event
    if (event.cancelledBy && event.cancelledBy.some(id => 
      registeredEvents.find(e => e.id === id)?.fired
    )) {
      return false;
    }

    // Time-triggered events
    if (event.type === 'time_trigger') {
      return (
        event.triggerDay === currentDay &&
        event.triggerGameMinute !== undefined &&
        currentGameMinutes >= event.triggerGameMinute
      );
    }

    return false;
  });

  // Fire events in order
  eventsToFire.forEach(event => {
    fireEvent(event, dispatch, getState);
  });
};

/**
 * Check and fire state-triggered events
 */
export const checkStateEvents = (
  dispatch: Dispatch<AnyAction>,
  getState: GetState
) => {
  const state = getState();

  const eventsToFire = registeredEvents.filter(event => {
    // Skip already fired events
    if (event.fired) return false;

    // Check if event was cancelled
    if (event.cancelledBy && event.cancelledBy.some(id => 
      registeredEvents.find(e => e.id === id)?.fired
    )) {
      return false;
    }

    // State-triggered events
    if (event.type === 'state_trigger' && event.triggerCondition) {
      return event.triggerCondition(state);
    }

    return false;
  });

  // Fire events
  eventsToFire.forEach(event => {
    fireEvent(event, dispatch, getState);
  });
};

/**
 * Fire a specific event
 */
const fireEvent = (
  event: GameEvent,
  dispatch: Dispatch<AnyAction>,
  getState: GetState
) => {
  // Mark as fired
  dispatch(eventFired(event.id));

  // Execute the event action
  event.action(dispatch, getState);

  // Log in development
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.log(`[EventScheduler] Fired event: ${event.id}`);
  }
};

/**
 * Manually trigger an event by ID
 */
export const manualTrigger = (eventId: string) => {
  if (!storeDispatch || !storeGetState) {
    console.error('Scheduler not initialized');
    return;
  }

  const event = registeredEvents.find(e => e.id === eventId);
  if (!event) {
    console.error(`Event ${eventId} not found`);
    return;
  }

  fireEvent(event, storeDispatch, storeGetState);
};

/**
 * Middleware for the Redux store to handle TICK actions
 */
export const schedulerMiddleware = (store: { dispatch: Dispatch<AnyAction>; getState: GetState }) => 
  (next: Dispatch<AnyAction>) => 
  (action: AnyAction) => {
    // Pass action through first
    const result = next(action);

    // Handle TICK actions
    if (action.type === GAME_TIME_TICK) {
      const state = store.getState();
      const gameTime = selectGameTime(state);

      // Sync registered events from Redux state
      const stateEvents = state.player?.events?.events;
      if (stateEvents && stateEvents.length > 0) {
        registeredEvents = stateEvents;
      }

      // Only check events if not paused
      if (!gameTime.isPaused) {
        checkTimeEvents(gameTime, store.dispatch, store.getState);
      }
    }

    // Handle SCHEDULE_EVENT actions (manual event triggers)
    if (action.type === 'SCHEDULE_EVENT') {
      const eventId = action.payload;
      manualTrigger(eventId);
    }

    return result;
  };

/**
 * Hook to check state events on relevant state changes
 */
export const checkStateEventsOnChange = () => {
  if (!storeDispatch || !storeGetState) return;
  checkStateEvents(storeDispatch, storeGetState);
};
