import { Channel, DirectMessageThread } from '../../types';

export const apexChannels: Channel[] = [
  {
    id: 'general',
    name: 'general',
    description: 'General announcements',
    messages: [
      {
        id: 'm1',
        senderId: 'pa',
        content: 'Please review the new expense policy.',
        timestamp: '2024-04-14T08:00:00',
        edited: false
      }
    ]
  }
];

export const apexDirectMessages: DirectMessageThread[] = [];
