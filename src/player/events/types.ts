/**
 * Event Scheduler Types
 * Part 4 — Event Scheduler
 * 
 * A scripted event system that fires game content at specific game times
 * or in response to state conditions.
 */

import { Dispatch, AnyAction } from 'redux';

// Type for getState function
export type GetState = () => any;

export interface GameEvent {
  id: string;
  type: 'time_trigger' | 'state_trigger' | 'manual';
  // For time_trigger:
  triggerDay?: number;
  triggerGameMinute?: number;
  // For state_trigger:
  triggerCondition?: (state: any) => boolean;
  // Payload:
  action: (dispatch: Dispatch<AnyAction>, getState: GetState) => void;
  fired: boolean;                   // prevent re-firing
  cancelledBy?: string[];             // other event ids that cancel this one if fired first
}

// Event scheduler state
export interface EventSchedulerState {
  events: GameEvent[];
  suspendedEventIds: string[];  // Events that are temporarily suspended (e.g., by dialogue)
}

// Action types
export const EVENT_FIRED = 'EVENT_FIRED';
export const SCHEDULE_EVENT = 'SCHEDULE_EVENT';
export const RESET_EVENTS = 'RESET_EVENTS';
export const SUSPEND_EVENT = 'SUSPEND_EVENT';
export const RESUME_EVENT = 'RESUME_EVENT';

// Action creators
export const eventFired = (eventId: string) => ({
  type: EVENT_FIRED,
  payload: eventId
});

export const scheduleEvent = (eventId: string) => ({
  type: SCHEDULE_EVENT,
  payload: eventId
});

export const resetEvents = () => ({
  type: RESET_EVENTS
});

export const suspendEvent = (eventId: string) => ({
  type: SUSPEND_EVENT,
  payload: eventId
});

export const resumeEvent = (eventId: string) => ({
  type: RESUME_EVENT,
  payload: eventId
});
