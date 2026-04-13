import { Email } from '../../types';

export const meridianInitialEmails: Email[] = [
  {
    id: '1',
    fromId: 'derek',
    toIds: ['player'],
    subject: 'Vantage — Monday Check-in',
    body: `Morning,

Just wanted to flag — I had a look at the Vantage tracker over the weekend and the milestone dates aren't looking great. Can you send me a written status update before the 10 o'clock? Nothing formal, just want to make sure we're aligned before I speak to Priya.

Also — can you make sure the risk register is up to date? She may ask.

Derek`,
    timestamp: '2024-04-14T08:14:00',
    read: false,
    threadId: 'vantage-checkin-1'
  },
  {
    id: '2',
    fromId: 'sandra',
    toIds: ['all'],
    subject: 'Company All-Hands — Friday 14:00 (PLEASE ACCEPT)',
    body: `Dear All,

Please find attached a calendar invitation for the Q2 Company All-Hands, taking place this Friday at 14:00 via Teams. Attendance is expected for all permanent staff.

Agenda items include: Q2 financial performance, the Axiom Digital integration update, and a message from James (CEO).

If you have agenda items to raise, please submit them to me by Wednesday COB.

Kind regards,
Sandra Osei
Executive Assistant to James Carruthers, CEO
Meridian Analytics`,
    timestamp: '2024-04-14T07:58:00',
    read: false,
    threadId: 'allhands-april'
  },
  {
    id: '3',
    fromId: 'marcus',
    toIds: ['player'],
    subject: 'RE: Vantage — Feature Request from Client',
    body: `Hey mate,

So I had a call with the NHS Digital team on Friday and they're really excited about the new cohort segmentation view — I may have given them the impression it was coming in the next sprint. I know we haven't scoped it yet but honestly it shouldn't be that big a lift, right?

Let's grab 15 mins this week. I'll find some time.

M`,
    timestamp: '2024-04-11T17:43:00',
    read: true,
    threadId: 'vantage-feature'
  },
  {
    id: '4',
    fromId: 'priya',
    toIds: ['derek', 'player'],
    subject: 'Vantage — Resource Allocation Q2',
    body: `Derek, [Player name],

Following last week's board review, I need a confirmed headcount plan for Vantage through end of Q2. We are currently running 11% over budget on contractor costs and I need to understand whether this is structural or a timing issue.

Please provide a breakdown by role by Wednesday.

Priya`,
    timestamp: '2024-04-11T06:12:00',
    read: true,
    threadId: 'vantage-resources'
  },
  {
    id: '5',
    fromId: 'jess',
    toIds: ['player'],
    subject: 'heads up (don\'t forward this)',
    body: `Hey —

Not sure if Derek has said anything to you yet but there was a conversation in the leadership meeting Thursday about Vantage. Apparently Marcus told James it was "back on track" which... I don't know where he got that from.

Just so you're not blindsided. Delete this after reading probably lol.

J`,
    timestamp: '2024-04-11T16:55:00',
    read: true,
    threadId: 'heads-up-vantage'
  },
  {
    id: '6',
    fromId: 'carl',
    toIds: ['player'],
    subject: 'RE: RE: RE: Laptop Replacement Request',
    body: `Hi,

Checked with procurement. Lead time is 6–8 weeks.

Carl
IT Support`,
    timestamp: '2024-04-09T09:30:00',
    read: true,
    threadId: 'laptop-request'
  }
];
