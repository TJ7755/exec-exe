/**
 * New Hire Onboarding Emails
 * Part 5 — New Hire Onboarding Emails
 * 
 * Replace the existing Outbox initial state entirely.
 * The inbox on Monday morning contains exactly these emails, in this order.
 */

import { Email } from '../../types';

// Generate employee number
const generateEmployeeNumber = () => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `MER-${digits}`;
};

// Store employee number for consistency
let cachedEmployeeNumber: string | null = null;

export const getEmployeeNumber = () => {
  if (!cachedEmployeeNumber) {
    cachedEmployeeNumber = generateEmployeeNumber();
  }
  return cachedEmployeeNumber;
};

// Create emails with player name interpolation
export const createNewHireEmails = (playerFirstName: string, playerLastName: string, playerFullName: string): Email[] => {
  const playerEmail = `${playerFirstName.toLowerCase()}.${playerLastName.toLowerCase()}@meridian.co.uk`;
  const employeeNumber = getEmployeeNumber();

  return [
    // Email 1 — Welcome from James Carruthers
    {
      id: 'welcome-james',
      fromId: 'james',
      toIds: ['player'],
      subject: 'Welcome to Meridian Analytics',
      body: `${playerFirstName},

Welcome to Meridian. I'm glad you're here.

Meridian Analytics exists to help public sector organisations make better decisions with their data. We work primarily with NHS trusts, local authorities, and central government departments — clients who are under real pressure and need insight they can act on, not dashboards that gather dust.

You're joining the Delivery team, which is the engine room of the business. We win clients through sales, but we keep them through delivery. Derek and the team will walk you through the specifics, but in short: your job is to make sure we do what we say we'll do, when we say we'll do it.

It's not a glamorous brief, but it's the most important one we have.

I'm usually around if you need anything. Sandra manages my diary — she's very good at it and very protective of it, so go through her.

Good luck today.

James Carruthers
Chief Executive Officer
Meridian Analytics`,
      timestamp: '2024-04-14T07:58:00',
      read: false,
      threadId: 'welcome-james'
    },

    // Email 2 — Formal Onboarding Pack from Sandra
    {
      id: 'onboarding-sandra',
      fromId: 'sandra',
      toIds: ['player'],
      subject: 'Your First Day — Action Required',
      body: `Dear ${playerFullName},

Welcome to Meridian Analytics. Please find below your first-day checklist.

REQUIRED TODAY
──────────────
1. Read and sign the Employee Handbook (attached — see Synergy Drive once access is provisioned by IT).
2. Complete the IT Acceptable Use Policy acknowledgement (Carl Briggs will be in touch).
3. Return your signed starter form to me by 17:00. A copy has been sent to your Meridian email.

YOUR DETAILS
──────────────
Role:           Project Manager
Department:     Delivery
Manager:        Derek Holt (d.holt@meridian.co.uk)
Start Date:     Monday 14 April 2024
Employee No:    ${employeeNumber}
IT Contact:     Carl Briggs (c.briggs@meridian.co.uk)

Your laptop has been prepared by IT. Please contact Carl if anything is missing.
Synergy Drive access will be provisioned within the hour (please allow until 10:00).

If you have any questions about your first day, I am available on Flack or by reply.

Kind regards,
Sandra Osei
Executive Assistant to James Carruthers
Meridian Analytics`,
      timestamp: '2024-04-14T08:02:00',
      read: false,
      threadId: 'onboarding-sandra'
    },

    // Email 3 — IT Setup from Carl
    {
      id: 'it-setup-carl',
      fromId: 'carl',
      toIds: ['player'],
      subject: 'IT Setup',
      body: `Hi,

Your laptop is ready. Password is Meridian2024! — change it when prompted.

Synergy Drive access: provisioning now, should be done by 10:00. If not, let me know.

Carl
IT Support | Ext. 204`,
      timestamp: '2024-04-14T08:45:00',
      read: false,
      threadId: 'it-setup-carl'
    },

    // Email 4 — Derek's Welcome
    {
      id: 'welcome-derek',
      fromId: 'derek',
      toIds: ['player'],
      subject: 'Morning — quick note before we speak',
      body: `Morning ${playerFirstName},

Just wanted to drop a note before our catch-up later. Looking forward to having you on the team.

Today will be fairly light — just getting you set up and across the basics. We've got a project on at the moment (Vantage — NHS Digital) that I'll brief you on during our 1:1. There are a few moving parts but nothing to worry about.

One thing: if you get any emails from Marcus Webb (Head of Sales) today, feel free to reply but loop me in if anything comes up about timelines or deliverables. He's great but sometimes gets ahead of himself.

See you on Flack at 10:30.

Derek`,
      timestamp: '2024-04-14T08:51:00',
      read: false,
      threadId: 'welcome-derek'
    }
  ];
};

// For backward compatibility, export as meridianInitialEmails
// This will be replaced at runtime with the player-specific version
export const meridianInitialEmailsNew: Email[] = createNewHireEmails('Player', 'Name', 'Player Name');

export default meridianInitialEmailsNew;
