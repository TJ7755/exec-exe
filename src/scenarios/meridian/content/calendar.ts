import { CalendarEntry } from '../../types';

export const meridianCalendar: CalendarEntry[] = [
  {
    id: 'cal-1',
    title: '1:1 with Derek Holt',
    dayOffset: 0,
    time: '09:30',
    duration: 30,
    medium: 'Flack call',
    mandatory: true
  },
  {
    id: 'cal-2',
    title: 'Vantage Sprint Planning',
    dayOffset: 0,
    time: '11:00',
    duration: 60,
    medium: 'Teams',
    mandatory: true
  },
  {
    id: 'cal-3',
    title: 'NHS Digital — Stakeholder Check-in',
    dayOffset: 1,
    time: '14:00',
    duration: 30,
    medium: 'Teams',
    mandatory: true
  },
  {
    id: 'cal-4',
    title: 'Axiom Migration Working Group',
    dayOffset: 2,
    time: '10:00',
    duration: 60,
    medium: 'Teams',
    mandatory: false
  },
  {
    id: 'cal-5',
    title: 'Q2 Company All-Hands',
    dayOffset: 4,
    time: '14:00',
    duration: 60,
    medium: 'Teams',
    mandatory: true
  }
];
