// Scenario data layer exports
export * from './types';
export * from './engine';
export { meridianScenario, createMeridianScenario } from './meridian';
export { blankTemplateScenario } from './blank-template';

import { Scenario } from './types';
import { meridianScenario } from './meridian';
import { blankTemplateScenario } from './blank-template';

// Available scenarios registry
export const availableScenarios: Scenario[] = [
  meridianScenario,
  blankTemplateScenario
];

// Get scenario by ID
export const getScenarioById = (id: string): Scenario | undefined => {
  return availableScenarios.find(s => s.id === id);
};

// Default scenario (Meridian)
export const defaultScenario = meridianScenario;
