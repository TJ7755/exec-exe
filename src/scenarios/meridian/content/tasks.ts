import { Task } from '../../types';

/**
 * Monday Initial Tasks — Meridian Infrastructure Services
 */
export const meridianTasks: Task[] = [
  // Player's To-Do (arrives at 13:00 via Nathaniel email)
  {
    id: 't-rw-recon',
    title: 'Royal Western Hospital — Boiler Plant Reconciliation',
    ownerId: 'player',
    priority: 'high',
    column: 'todo'
  },
  // AUP task (arrives at 09:20)
  {
    id: 't-aup',
    title: 'Read and acknowledge MIS Acceptable Use Policy',
    ownerId: 'player',
    priority: 'medium',
    column: 'todo'
  },

  // In Progress (others)
  {
    id: 't-q1-cleanup',
    title: 'Q1 Reconciliation — Harry cleanup (claimed complete)',
    ownerId: 'harry',
    priority: 'high',
    column: 'inProgress'
  },
  {
    id: 't-trust-mapping',
    title: 'Trust interface mapping — Royal Eastern & Northern',
    ownerId: 'rosa',
    priority: 'medium',
    column: 'inProgress'
  },

  // Done
  {
    id: 't-asset-onboard',
    title: 'Asset onboarding process — 47 new boilers',
    ownerId: 'nathaniel',
    priority: 'medium',
    column: 'done'
  }
];
