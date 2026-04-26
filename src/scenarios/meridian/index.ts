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
  try {
    const playerFullName = `${firstName} ${lastName}`;
    
    // Defensive check: ensure createDay1Tasks returns an array
    const day1Tasks = createDay1Tasks();
    const safeTasks = Array.isArray(day1Tasks) ? day1Tasks : [];
    
    // Defensive check: ensure createDay1InitialEmails returns an array
    const day1Emails = createDay1InitialEmails();
    const safeEmails = Array.isArray(day1Emails) ? day1Emails : [];
    
    // Defensive check: ensure npcs is an array
    const safeNpcs = Array.isArray(npcs) ? npcs : [];
    
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
      npcs: safeNpcs,
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
      initialEmails: safeEmails,
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
      tasks: safeTasks.map(task => ({
        id: task.id,
        title: task.title,
        ownerId: 'player',
        priority: 'medium',
        column: task.status === 'done' ? 'done' : 'todo'
      })),
      riskRegister: [],
      calendar: []
    };
  } catch (e) {
    console.error('[createMeridianScenario] Error:', e);
    // Return a minimal fallback scenario
    return {
      id: 'fallback',
      title: 'Fallback Scenario',
      description: 'Error loading scenario',
      difficulty: 'medium' as const,
      company: {
        id: 'fallback',
        name: 'Fallback',
        shortName: 'FB',
        tagline: 'Fallback',
        accentColour: '#000000',
        size: 'scaleup' as const,
        sector: 'Unknown',
        description: 'Fallback'
      },
      npcs: [],
      player: {
        name: `${firstName} ${lastName}`,
        role: 'Unknown',
        department: 'Unknown',
        managerId: '',
        salary: 0,
        startDate: '',
        internalTitle: 'Unknown',
        employeeNumber: ''
      },
      initialEmails: [],
      channels: [],
      directMessages: [],
      fileTree: [],
      tasks: [],
      riskRegister: [],
      calendar: []
    };
  }
};

export const meridianScenario = createMeridianScenario('Player', 'Name');
