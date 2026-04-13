import { Scenario } from '../types';
import { meridianCompany } from './company';
import { meridianNPCs } from './npcs';
import { meridianPlayer } from './player';
import { createNewHireEmails } from './content/emails-new';
import { createNewHireChannels, createNewHireDMs } from './content/channels-new';
import { meridianFileTree } from './content/documents';
import { meridianTasks } from './content/tasks';
import { meridianRiskRegister } from './content/risk-register';
import { meridianCalendar } from './content/calendar';

// Helper to generate deterministic 4-digit employee number from first name
const generateEmployeeNumber = (firstName: string): string => {
  // Sum ASCII values of first 4 characters (or all if shorter), mod 10000
  const chars = firstName.slice(0, 4).toLowerCase();
  let sum = 0;
  for (let i = 0; i < chars.length; i++) {
    sum += chars.charCodeAt(i);
  }
  // Add length multiplier for more distribution
  sum = (sum * (firstName.length + 7)) % 10000;
  return `MIS-${sum.toString().padStart(4, '0')}`;
};

// New hire scenario factory - creates scenario with player-specific content
export const createMeridianScenario = (playerFirstName: string, playerLastName: string): Scenario => {
  const playerFullName = `${playerFirstName} ${playerLastName}`;
  const employeeNumber = generateEmployeeNumber(playerFirstName);

  return {
    id: 'meridian-infrastructure-services-v1',
    title: 'Meridian Infrastructure Services',
    description: 'Junior Data Asset Officer at an NHS infrastructure MSP. Reconcile spreadsheets, manage dashboards, and discover why 50,000 hospital assets may not exist where the data says they do.',
    difficulty: 'medium',
    company: meridianCompany,
    npcs: meridianNPCs,
    player: {
      ...meridianPlayer,
      name: playerFullName,
      employeeNumber
    },
    initialEmails: createNewHireEmails(playerFirstName, playerLastName, playerFullName, employeeNumber),
    channels: createNewHireChannels(playerFirstName),
    directMessages: createNewHireDMs(),
    fileTree: meridianFileTree,
    tasks: meridianTasks,
    riskRegister: meridianRiskRegister,
    calendar: meridianCalendar
  };
};

// Default scenario (for backward compatibility)
export const meridianScenario: Scenario = createMeridianScenario('Player', 'Name');

export * from './company';
export * from './npcs';
export * from './player';
export * from './content/emails';
export * from './content/channels';
export * from './content/documents';
export * from './content/tasks';
export * from './content/risk-register';
export * from './content/calendar';
