import { Scenario } from '../types';
import { apexCompany } from './company';
import { apexNPCs } from './npcs';
import { apexPlayer } from './player';
import { apexInitialEmails } from './content/emails';
import { apexChannels, apexDirectMessages } from './content/channels';
import { apexFileTree } from './content/documents';
import { apexTasks } from './content/tasks';
import { apexRiskRegister } from './content/risk-register';
import { apexCalendar } from './content/calendar';

export const blankTemplateScenario: Scenario = {
  id: 'blank-template',
  title: 'Apex Consulting',
  description: 'A minimal template scenario for creating new experiences.',
  difficulty: 'easy',
  company: apexCompany,
  npcs: apexNPCs,
  player: apexPlayer,
  initialEmails: apexInitialEmails,
  channels: apexChannels,
  directMessages: apexDirectMessages,
  fileTree: apexFileTree,
  tasks: apexTasks,
  riskRegister: apexRiskRegister,
  calendar: apexCalendar
};
