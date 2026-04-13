/**
 * New Hire Flack Initial State
 * Part 5 — Flack initial state for new hire scenario
 * 
 * #general - morning messages
 * #vantage-project - empty on Monday morning
 * #it-helpdesk - IT provisioning message
 * Direct Messages - all empty on arrival, populated by events
 */

import { Channel, DirectMessageThread, Message } from '../../types';

const createMessage = (id: string, senderId: string, content: string, timestamp: string): Message => ({
  id,
  senderId,
  content,
  timestamp,
  edited: false
});

// Create channels with player name interpolation
export const createNewHireChannels = (playerFirstName: string): Channel[] => [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and general chat',
    messages: [
      createMessage('m1', 'sandra', 'Good morning everyone. Please check your emails for any first-day communications if you have a new starter joining today.', '2024-04-14T08:00:00'),
      createMessage('m2', 'marcus', 'Morning all 👋', '2024-04-14T08:09:00'),
      createMessage('m3', 'jess', 'Morning! Welcome to whoever\'s joining today 😊', '2024-04-14T08:34:00'),
      createMessage('m4', 'derek', `Morning. ${playerFirstName} — I've sent you an email. See you at 10:30.`, '2024-04-14T08:52:00')
    ]
  },
  {
    id: 'vantage-project',
    name: 'vantage-project',
    description: 'NHS Digital Vantage project coordination',
    messages: [
      // Empty on Monday morning. First message arrives at the standup event at 11:00.
    ]
  },
  {
    id: 'it-helpdesk',
    name: 'it-helpdesk',
    description: 'IT support and technical issues',
    messages: [
      createMessage('m5', 'carl', 'New starter access provisioning in progress. Will update when complete.', '2024-04-14T08:45:00')
    ]
  }
];

// Direct Messages — all empty on arrival. Populated by events.
export const createNewHireDMs = (): DirectMessageThread[] => [
  {
    participantId: 'derek',
    messages: []  // Populated by mon_derek_1to1 event at 10:30
  },
  {
    participantId: 'jess',
    messages: []   // Populated by events
  },
  {
    participantId: 'marcus',
    messages: []   // Populated by mon_marcus_dm event at 14:00
  },
  {
    participantId: 'sandra',
    messages: []   // Populated by events if needed
  },
  {
    participantId: 'carl',
    messages: []   // Populated by events
  }
];

// For backward compatibility
export const meridianChannelsNew = createNewHireChannels('Player');
export const meridianDirectMessagesNew = createNewHireDMs();

export default { meridianChannelsNew, meridianDirectMessagesNew };
