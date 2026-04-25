import { Scenario } from '../types';
import { company } from './company';
import { npcs } from './npcs';
import { playerConfig } from './player';
import { createDay1InitialEmails } from './content/emails';
import { createDay1Tasks } from './content/tasks';

export * from './company';
export * from './npcs';
export * from './player';

export const createMeridianScenario = (firstName: string, lastName: string): Scenario => {
  const playerFullName = `${firstName} ${lastName}`;
  return {
    id: 'meridian-education-group',
    title: 'Meridian Education Group',
    description: 'Curriculum Data Intern',
    difficulty: 'medium',
    company: {
      id: 'meridian-education-group',
      name: company.name,
      shortName: 'MEG',
      tagline: company.tagline,
      accentColour: '#1B3A5C',
      size: 'scaleup',
      sector: 'Education',
      description: company.tagline
    },
    npcs,
    player: {
      name: playerFullName,
      role: playerConfig.title,
      department: playerConfig.department,
      managerId: 'nathaniel',
      salary: 24000,
      startDate: '2025-03-03T09:00:00',
      internalTitle: playerConfig.title,
      employeeNumber: 'MEG-0000'
    },
    initialEmails: createDay1InitialEmails(),
    channels: [
      {
        id: 'general',
        name: 'general',
        description: 'General Meridian chatter',
        messages: []
      }
    ],
    directMessages: [],
    fileTree: [],
    tasks: createDay1Tasks().map(task => ({
      id: task.id,
      title: task.title,
      ownerId: 'player',
      priority: 'medium',
      column: task.status === 'done' ? 'done' : 'todo'
    })),
    riskRegister: [],
    calendar: []
  };
};

export const meridianScenario = createMeridianScenario('Player', 'Name');
