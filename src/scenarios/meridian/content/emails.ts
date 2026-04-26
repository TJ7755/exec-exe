import { Email } from "../../types";

export const JAMES_WELCOME_EMAIL_ID = "d1-james-welcome";
export const HR_PROGRESS_EMAIL_ID = "d1-hr-progress-update";
export const PAUL_CREDENTIALS_EMAIL_ID = "d1-paul-credentials";

export const createDay1InitialEmails = (): Email[] => [
  {
    id: JAMES_WELCOME_EMAIL_ID,
    fromId: "james",
    toIds: ["player"],
    subject: "Welcome to Meridian Education Group",
    body: `Dear [PLAYER],

Welcome to Meridian Education Group.

I trust your first day has been instructive, if not immediately enlightening — the two rarely coincide.

I would encourage you, as you find your feet, to attend carefully to the documents we produce and the claims we make therein. Meridian's work touches real children in real schools. That is not a small thing.

I look forward to working alongside you.

With every good wish,
Dr James Siren
Academic Director`,
    timestamp: "2025-03-03T08:47:00",
    read: false,
    threadId: JAMES_WELCOME_EMAIL_ID,
  },
];

export const createHrProgressEmail = (): Email => ({
  id: HR_PROGRESS_EMAIL_ID,
  fromId: "hr-system",
  toIds: ["player"],
  subject: "HR Onboarding Forms – Progress Update",
  body: `Hi [PLAYER] 👋,

Just picking this up — I can see that your New Starter HR Forms have now been completed and are, from a high-level perspective, moving through the system.

We are currently cascading these upwards for processing, so in terms of overall alignment this is broadly where we would expect to be at this stage 📊.

Payroll setup is in progress, HOWEVER you should not assume this is finalized until you receive confirmation, but we should be working on the basis that it is progressing as expected.

You will be receiving your contract and login confirmations shortly, or imminently, depending on timing.

From a wider impact point of view, this is a strong step forward in embedding you into the organization and driving early-stage momentum 📈.

Please ensure you are ready to action next steps as they come through so we can maintain pace.

Warm regards,
Meridian HR Team 🌱📈`,
  timestamp: new Date().toISOString(),
  read: false,
  threadId: HR_PROGRESS_EMAIL_ID,
});

export const createPaulCredentialsEmail = (timestamp: string): Email => ({
  id: PAUL_CREDENTIALS_EMAIL_ID,
  fromId: "paul",
  toIds: ["player"],
  subject: "SynergyDrive Credentials",
  body: `[PLAYER],

Your SynergyDrive credentials are below. Keep these secure.

Username: [PLAYER]@meridian-edu.co.uk
Password: Meridian2025!

Access SynergyDrive via the desktop shortcut. If you have issues, contact IT through the helpdesk link in MeridianBrowse.

Paul`,
  timestamp,
  read: false,
  threadId: PAUL_CREDENTIALS_EMAIL_ID,
});

