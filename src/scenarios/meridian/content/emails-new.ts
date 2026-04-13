/**
 * Monday Initial Emails — Meridian Infrastructure Services
 * 
 * The inbox on Monday morning contains exactly these emails.
 * Employee number is generated deterministically from first name in the scenario factory.
 */

import { Email } from '../../types';

// Create emails with player name interpolation
// Employee number is passed in from scenario factory (deterministic)
export const createNewHireEmails = (playerFirstName: string, playerLastName: string, playerFullName: string, employeeNumber: string): Email[] => {
  const playerEmail = `${playerFirstName.toLowerCase()}.${playerLastName.toLowerCase()}@meridian-is.co.uk`;

  return [
    // Email 1 — Welcome from James Siren (COO)
    {
      id: 'welcome-james',
      fromId: 'james',
      toIds: ['player'],
      subject: 'Welcome to Meridian Infrastructure Services',
      body: `${playerFirstName},

I write to welcome you to Meridian Infrastructure Services on what I trust will prove to be the first morning of a long and productive tenure with us.

We are, at our core, a stewardship organisation. The hospitals we serve cannot function without the infrastructure we manage. Every boiler we monitor, every generator we track, every fire suppression system we record — these are not abstractions. They are the conditions under which surgeons operate and patients recover. I hope you will carry that weight with the gravity it deserves.

Your role — Junior Data Asset Officer — sits at the foundation of everything we do. The integrity of our asset data is the integrity of our service. Without accurate records, we are, as the Psalmist might say, building on sand.

Nathaniel Willers will be your line manager. He will set you to work this morning. I ask only that you approach your responsibilities with diligence, rigour, and — above all — honesty.

Welcome aboard.

James Siren
Chief Operating Officer
Meridian Infrastructure Services`,
      timestamp: '2024-04-14T07:43:00',
      read: false,
      threadId: 'welcome-james'
    },

    // Email 2 — Formal Onboarding Pack from Sandra Osei
    {
      id: 'onboarding-sandra',
      fromId: 'sandra',
      toIds: ['player'],
      subject: 'First Day — Required Actions',
      body: `Dear ${playerFullName},

Welcome to MIS. Please complete the following before 17:00 today.

REQUIRED
─────────────────────────────────────────────────────
1. Read and acknowledge the MIS Acceptable Use Policy (link in Synergy Drive once access is provisioned — IT will confirm).
2. Complete your starter declaration form (attached to this email as a Synergy Drive task).
3. Attend your 10:00 onboarding with Nathaniel Willers (Flack DM — he will contact you directly).

YOUR DETAILS
─────────────────────────────────────────────────────
Role:           Junior Data Asset Officer
Department:     Asset Data Management
Manager:        Nathaniel Willers
Employee No:    ${employeeNumber}
Start Date:     Monday 14 April 2024
IT Contact:     IT Support (it@meridian-is.co.uk, Ext. 204)

If you have any questions please reply to this email.

Kind regards,
Sandra Osei
Executive Assistant to the COO`,
      timestamp: '2024-04-14T08:01:00',
      read: false,
      threadId: 'onboarding-sandra'
    },

    // Email 3 — IT Setup from IT Support
    {
      id: 'it-setup',
      fromId: 'it',
      toIds: ['player'],
      subject: 'IT Setup',
      body: `Hi ${playerFirstName},

Your laptop is ready. Password is MIS2024! — change it when prompted.

AssetView access: provisioning now, should be done by 10:00. If not, let me know.

IT Support
Ext. 204`,
      timestamp: '2024-04-14T08:45:00',
      read: false,
      threadId: 'it-setup'
    }
  ];
};

// For backward compatibility, export as meridianInitialEmails
// This will be replaced at runtime with the player-specific version
export const meridianInitialEmailsNew: Email[] = createNewHireEmails('Player', 'Name', 'Player Name', 'MIS-0000');

export default meridianInitialEmailsNew;
