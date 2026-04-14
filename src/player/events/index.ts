/**
 * Event System Index
 * Exports all events and the scheduler
 */

export * from './types';
export * from './scheduler';

// Re-export events from monday and tuesday
import { mondayEvents } from './monday';
import { tuesdayEvents } from './tuesday';

export { mondayEvents, tuesdayEvents };

// Export calendar event utilities
export * from './calendarEvents';
