/**
 * Monday Flack Initial State — Meridian Infrastructure Services
 * 
 * #general - morning messages from team
 * #asset-data-team - empty on Monday morning, populated by standup
 * #it-helpdesk - IT provisioning message
 * Direct Messages - all empty on arrival, populated by Monday events
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
      createMessage('m1', 'sandra', 'Morning everyone. New starter joining Asset Data today — please make them feel welcome.', '2024-04-14T08:00:00'),
      createMessage('m2', 'james', 'A warm welcome to all who join us in service of the mission.', '2024-04-14T08:07:00'),
      createMessage('m3', 'harry', 'Welcome! Big things happening in the data team at the moment. Exciting time to join �', '2024-04-14T08:09:00'),
      createMessage('m4', 'rosa', 'Morning. Welcome.', '2024-04-14T08:11:00'),
      createMessage('m5', 'tom', `oh hey! I started two weeks ago. DM me if you need anything. Actually DM me anyway this place is confusing`, '2024-04-14T08:14:00')
    ]
  },
  {
    id: 'asset-data-team',
    name: 'asset-data-team',
    description: 'Asset Data Management team coordination',
    messages: [
      createMessage('m6', 'nathaniel', `Morning team. New starter joins us today. ${playerFirstName} will be onboarding this morning and getting onto the Royal Western reconciliation this afternoon. Harry — can you make sure the shared drive folder is set up?`, '2024-04-14T08:52:00'),
      createMessage('m7', 'harry', 'Already done. Set it up last night actually. It\'s all there.', '2024-04-14T08:54:00')
    ]
  },
  {
    id: 'it-helpdesk',
    name: 'it-helpdesk',
    description: 'IT support and technical issues',
    messages: [
      createMessage('m8', 'it', 'New starter AssetView access provisioning in progress. Will update when complete.', '2024-04-14T08:45:00')
    ]
  }
];

// Direct Messages — all empty on arrival. Populated by Monday events.
export const createNewHireDMs = (): DirectMessageThread[] => [
  {
    participantId: 'nathaniel',
    messages: []  // Populated by mon_nathaniel_onboarding event at 10:00
  },
  {
    participantId: 'claire',
    messages: []   // External NHS contact
  },
  {
    participantId: 'james',
    messages: []   // Executive
  },
  {
    participantId: 'harry',
    messages: []   // Populated by mon_harry_introduces_himself at 10:30
  },
  {
    participantId: 'rosa',
    messages: []   // Populated by mon_rosa_introduction at 10:50
  },
  {
    participantId: 'tom',
    messages: []   // Populated by mon_tom_welcome at 09:10
  },
  {
    participantId: 'diane',
    messages: []   // External NHS contact
  },
  {
    participantId: 'sandra',
    messages: []   // Executive Assistant
  }
];

// For backward compatibility
export const meridianChannelsNew = createNewHireChannels('Player');
export const meridianDirectMessagesNew = createNewHireDMs();

export default { meridianChannelsNew, meridianDirectMessagesNew };
