import { Channel, DirectMessageThread, Message } from '../../types';

const createMessage = (id: string, senderId: string, content: string, timestamp: string): Message => ({
  id,
  senderId,
  content,
  timestamp,
  edited: false
});

export const meridianChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    description: 'Company-wide announcements and general chat',
    messages: [
      createMessage('m1', 'sandra', 'Reminder — All-Hands calendar invite has been sent. Please accept.', '2024-04-14T08:00:00'),
      createMessage('m2', 'marcus', 'On it Sandra 👍', '2024-04-14T08:03:00'),
      createMessage('m3', 'jess', 'Morning all', '2024-04-14T08:31:00'),
      createMessage('m4', 'derek', 'Morning. Busy one today.', '2024-04-14T08:45:00')
    ]
  },
  {
    id: 'vantage-project',
    name: 'vantage-project',
    description: 'NHS Digital Vantage project coordination',
    messages: [
      createMessage('m5', 'derek', 'Team — end of sprint review notes are in Synergy Drive. Can everyone make sure actions are updated before Monday morning.', '2024-04-11T17:01:00'),
      createMessage('m6', 'jess', 'Done on my side', '2024-04-11T17:09:00'),
      createMessage('m7', 'marcus', 'Cheers all, great sprint 💪', '2024-04-11T17:34:00'),
      createMessage('m8', 'derek', '[Player name] — have you seen my email?', '2024-04-14T08:47:00')
    ]
  },
  {
    id: 'it-helpdesk',
    name: 'it-helpdesk',
    description: 'IT support and technical issues',
    messages: [
      createMessage('m9', 'carl', 'Hi all. Reminder that ticket response SLA is 3 business days. Please do not chase before then.', '2024-04-10T09:14:00')
    ]
  }
];

export const meridianDirectMessages: DirectMessageThread[] = [
  {
    participantId: 'derek',
    messages: [
      createMessage('dm1', 'derek', 'Morning — just flagging I need that Vantage update before 10. Let me know if you need anything from me.', '2024-04-14T08:48:00')
    ]
  },
  {
    participantId: 'jess',
    messages: [
      createMessage('dm2', 'jess', 'Hey, you okay? Derek seems stressed this morning lol', '2024-04-14T08:52:00')
    ]
  },
  {
    participantId: 'marcus',
    messages: [
      createMessage('dm3', 'marcus', 'Morning mate! Good weekend?', '2024-04-14T09:01:00'),
      createMessage('dm4', 'marcus', 'Did you get my email btw', '2024-04-14T09:02:00')
    ]
  }
];
