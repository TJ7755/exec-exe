import { CalendarEntry } from '../../types';

/**
 * Monday Calendar — Meridian Infrastructure Services
 */
export const meridianCalendar: CalendarEntry[] = [
  // Monday (Day 1)
  {
    id: 'cal-mon-1',
    title: '1:1 with Nathaniel Willers — Onboarding',
    dayOffset: 0,
    time: '10:00',
    duration: 30,
    medium: 'Flack DM',
    mandatory: true
  },
  {
    id: 'cal-mon-lunch',
    title: 'Lunch Break',
    dayOffset: 0,
    time: '12:00',
    duration: 60,
    medium: 'Canteen',
    mandatory: false
  },
  {
    id: 'cal-mon-standup',
    title: 'Asset Data Team Standup',
    dayOffset: 0,
    time: '14:00',
    duration: 15,
    medium: '#asset-data-team',
    mandatory: false
  },
  {
    id: 'cal-mon-eod',
    title: 'End of Day Check-in',
    dayOffset: 0,
    time: '16:30',
    duration: 30,
    medium: 'Flack DM',
    mandatory: false
  },

  // Tuesday (Day 2) — Preview for end-of-day summary
  {
    id: 'cal-tue-standup',
    title: 'Team Standup',
    dayOffset: 1,
    time: '09:00',
    duration: 15,
    medium: '#asset-data-team',
    mandatory: true
  },
  {
    id: 'cal-tue-review',
    title: 'Data Quality Review',
    dayOffset: 1,
    time: '11:00',
    duration: 60,
    medium: 'ExecuTerm',
    mandatory: true
  }
];
