import { Email } from '../../types';

export const apexInitialEmails: Email[] = [
  {
    id: '1',
    fromId: 'ceo',
    toIds: ['player'],
    subject: 'Welcome to Apex',
    body: `Welcome to the team.

Your first assignment begins immediately. Report to my office at 09:00.

Richard`,
    timestamp: '2024-04-14T08:00:00',
    read: false,
    threadId: 'welcome'
  }
];
