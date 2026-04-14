/**
 * Calendar Event Integration
 * 
 * Converts CalendarEntry items from scenario data into time-triggered GameEvents
 * that generate notifications at the appropriate game times.
 * 
 * Creates two events per calendar entry:
 * 1. Pre-event warning (configurable minutes before)
 * 2. Event start notification (at scheduled time)
 */

import { GameEvent, eventFired } from './types';
import { CalendarEntry } from '../../scenarios/types';
import { addNotification } from '../store';
import { Dispatch, AnyAction } from 'redux';

// Configuration
const PRE_EVENT_WARNING_MINUTES = 10; // Notify 10 game-minutes before event

/**
 * Parse time string (HH:MM) to game minutes from midnight
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Format game minutes to time string for display
 */
const formatGameTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Generate GameEvents from a calendar entry
 * Returns array of events: [pre-warning, start-notification]
 */
export const generateCalendarEvents = (entry: CalendarEntry): GameEvent[] => {
  const events: GameEvent[] = [];
  const startMinutes = parseTimeToMinutes(entry.time);
  const day = entry.dayOffset + 1; // dayOffset is 0-based, triggerDay is 1-based

  // 1. Pre-event warning (if there's enough time before)
  if (startMinutes >= PRE_EVENT_WARNING_MINUTES) {
    const warningMinutes = startMinutes - PRE_EVENT_WARNING_MINUTES;
    
    events.push({
      id: `cal-warning-${entry.id}`,
      type: 'time_trigger',
      triggerDay: day,
      triggerGameMinute: warningMinutes,
      fired: false,
      action: (dispatch: Dispatch<AnyAction>) => {
        dispatch(addNotification({
          title: entry.title,
          body: `${entry.medium} — in ${PRE_EVENT_WARNING_MINUTES} minutes`,
          urgency: entry.mandatory ? 'normal' : 'low',
          appId: 'calendar',
          deepLink: `event-${entry.id}`,
          triggerSource: 'calendar',
          relatedId: entry.id
        }));
      }
    });
  }

  // 2. Event start notification
  events.push({
    id: `cal-start-${entry.id}`,
    type: 'time_trigger',
    triggerDay: day,
    triggerGameMinute: startMinutes,
    fired: false,
    action: (dispatch: Dispatch<AnyAction>) => {
      dispatch(addNotification({
        title: entry.title,
        body: entry.mandatory 
          ? `${entry.medium} — starting now (mandatory)`
          : `${entry.medium} — starting now`,
        urgency: entry.mandatory ? 'normal' : 'low',
        appId: 'calendar',
        deepLink: `event-${entry.id}`,
        triggerSource: 'calendar',
        relatedId: entry.id
      }));
    }
  });

  return events;
};

/**
 * Generate calendar events for all entries in a calendar array
 */
export const generateAllCalendarEvents = (calendarEntries: CalendarEntry[]): GameEvent[] => {
  return calendarEntries.flatMap(entry => generateCalendarEvents(entry));
};

/**
 * Get upcoming calendar events for a specific day
 * Returns entries that haven't fired yet for the given day
 */
export const getUpcomingCalendarEvents = (
  calendarEntries: CalendarEntry[],
  firedEventIds: string[],
  currentDay: number
): CalendarEntry[] => {
  return calendarEntries.filter(entry => {
    const entryDay = entry.dayOffset + 1;
    const warningId = `cal-warning-${entry.id}`;
    const startId = `cal-start-${entry.id}`;
    
    // Only show entries for current or future days
    if (entryDay < currentDay) return false;
    
    // Don't show if both events have fired
    const warningFired = firedEventIds.includes(warningId);
    const startFired = firedEventIds.includes(startId);
    
    return !(warningFired && startFired);
  });
};

/**
 * Check if a calendar event has any pending notifications
 */
export const hasPendingCalendarNotification = (
  entry: CalendarEntry,
  firedEventIds: string[]
): boolean => {
  const warningId = `cal-warning-${entry.id}`;
  const startId = `cal-start-${entry.id}`;
  
  return !firedEventIds.includes(warningId) || !firedEventIds.includes(startId);
};
