import { NPC } from '../types';

export const meridianNPCs: NPC[] = [

  {
    id: 'nathaniel',
    name: 'Nathaniel Willers',
    firstName: 'Nathaniel',
    role: 'Head of Asset Data Management',
    department: 'Asset Data Management',
    avatarColour: '#7B68EE',
    email: 'n.willers@meridian-is.co.uk',
    extension: '301',
    voice: `Nathaniel speaks with tremendous confidence about things he does not
      understand. He uses technical-sounding phrases incorrectly. He has never
      opened the spreadsheets he oversees. He was promoted because he is very
      good at presenting to people who also do not understand the spreadsheets.
      He believes the dashboards represent reality. He is the player's direct
      manager.`,
    onlineStatus: 'online',
    responses: {
      mon_task_acknowledged_committed:
        "Brilliant. That's exactly the kind of proactive attitude we need on the team. " +
        "The reconciliation work is absolutely fundamental to what we do here — strategic " +
        "work, really.",

      mon_task_acknowledged_questioned:
        "Great question. The short answer is: Sheet A is what the hospitals say they have, " +
        "Sheet B is what we say they have. Your job is to make them agree. Simple as that.",

      mon_task_acknowledged_pushed_back:
        "I hear you, but let's not overcomplicate it. The process is well-established. " +
        "Just get the numbers aligned and we can discuss the methodology another time.",

      mon_derek_asked_what_matters:
        "What matters is the dashboard stays green. Everything else is process.",

      mon_nathaniel_truth_response:
        "Right. Yes. That's... well, that's something I'll need to look into. " +
        "Leave it with me. For now, let's focus on getting the dashboard to where it needs to be.",
    }
  },

  {
    id: 'claire',
    name: 'Claire Talker',
    firstName: 'Claire',
    role: 'NHS England — Programme Director, Digital Infrastructure',
    department: 'External — Client',
    avatarColour: '#C0392B',
    email: 'c.talker@nhsengland.nhs.uk',
    extension: null,          // external contact
    voice: `Claire is the client. She is meticulous, political, and has learned
      that the best way to protect herself is to keep her requirements vague until
      a deliverable is submitted, then change them. She has never done this
      maliciously — she genuinely believes her new requirements were always the
      requirements. She is politely devastating in writing and completely
      charming in person. She is the most dangerous person in the game.`,
    onlineStatus: 'away',
    responses: {}
  },

  {
    id: 'james',
    name: 'James Siren',
    firstName: 'James',
    role: 'Chief Operating Officer',
    department: 'Executive',
    avatarColour: '#2C3E50',
    email: 'j.siren@meridian-is.co.uk',
    extension: '101',
    voice: `James speaks exclusively in the register of a Church of England
      bishop delivering a sermon at a Cambridge college chapel. Every sentence
      contains at minimum one classical or biblical allusion. He is authoritarian
      in the way that only people who believe they are being reasonable can be.
      He uses phrases like "I think we can all agree" before stating things that
      nobody agreed to. He has extremely strong opinions about process, hierarchy,
      and the correct way to format a spreadsheet. He genuinely believes he is
      a good person and a good leader. He is neither.`,
    onlineStatus: 'online',
    responses: {}
  },

  {
    id: 'harry',
    name: 'Harry Holmes',
    firstName: 'Harry',
    role: 'Senior Data Asset Analyst',
    department: 'Asset Data Management',
    avatarColour: '#E67E22',
    email: 'h.holmes@meridian-is.co.uk',
    extension: '312',
    voice: `Harry is convinced he is the most technically capable person at MIS,
      possibly in the sector. He speaks about his own work with awe. He makes
      significant errors — data deletions, formula overwrites, miscategorisations
      — and in each case genuinely cannot identify himself as the cause. He is
      not malicious. He is something worse: confidently, structurally wrong, and
      completely unreachable by evidence. He will blame the player for his errors
      before the end of the first week.`,
    onlineStatus: 'online',
    responses: {}
  },

  {
    id: 'rosa',
    name: 'Rosa Vega',
    firstName: 'Rosa',
    role: 'Infrastructure Data Contractor',
    department: 'Asset Data Management',
    avatarColour: '#27AE60',
    email: 'r.vega@meridian-is.co.uk',
    extension: '318',
    voice: `Rosa has been contracting at MIS for six years. She knows exactly
      where every discrepancy in every spreadsheet came from and why it has never
      been fixed. She helps new starters with the directness of someone who has
      decided not to care about internal politics because she is leaving in three
      months. She is the only person at MIS who consistently tells the truth.
      She does this because she finds it easier, not because she is noble.`,
    onlineStatus: 'online',
    responses: {}
  },

  {
    id: 'tom',
    name: 'Tom Adeyemi',
    firstName: 'Tom',
    role: 'Junior Data Asset Officer',
    department: 'Asset Data Management',
    avatarColour: '#3498DB',
    email: 't.adeyemi@meridian-is.co.uk',
    extension: '322',
    voice: `Tom started two weeks before the player. He has moved through the
      five stages of grief about the job and is currently somewhere between
      acceptance and gallows humour. He is extremely useful as a source of
      institutional knowledge for someone who has been there a fortnight. He
      will tell the player things they need to know, usually in the form of
      a warning delivered too late to be helpful.`,
    onlineStatus: 'online',
    responses: {}
  },

  {
    id: 'diane',
    name: 'Diane Osei',
    firstName: 'Diane',
    role: 'Facilities Manager — Royal Western Hospital',
    department: 'External — NHS Client Site',
    avatarColour: '#8E44AD',
    email: 'd.osei@royalwestern.nhs.uk',
    extension: null,
    voice: `Diane manages the physical facilities at Royal Western Hospital,
      one of the 15 MIS client sites. She emails MIS when something in the real
      world does not match what the dashboard says. She is specific, factual,
      and running out of patience. She represents the only contact between the
      player's spreadsheet existence and the physical consequences of their work.
      Her emails are the most important ones in the game.`,
    onlineStatus: 'away',
    responses: {}
  },

  {
    id: 'sandra',
    name: 'Sandra Osei',
    firstName: 'Sandra',
    role: 'Executive Assistant to the COO',
    department: 'Executive',
    avatarColour: '#F39C12',
    email: 's.osei@meridian-is.co.uk',
    extension: '102',
    voice: `Sandra manages James Siren's diary and communications. She is
      efficient, formal, and sends calendar invites for things that are emails.
      She is not related to Diane Osei. This coincidence has never been
      commented on internally.`,
    onlineStatus: 'online',
    responses: {}
  },

];

export const getNPCById = (id: string): NPC | undefined => {
  return meridianNPCs.find(npc => npc.id === id);
};
