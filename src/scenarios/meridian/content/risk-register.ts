import { RiskItem } from '../../types';

export const meridianRiskRegister: RiskItem[] = [
  {
    id: 'R1',
    description: 'Schema sign-off delay blocking integration testing',
    ownerId: 'player',
    likelihood: 'High',
    impact: 'High',
    status: 'Open'
  },
  {
    id: 'R2',
    description: 'Cohort segmentation scope creep from Sales commitment',
    ownerId: 'player',
    likelihood: 'High',
    impact: 'Medium',
    status: 'Open'
  },
  {
    id: 'R3',
    description: 'Contractor budget overrun Q2',
    ownerId: 'derek',
    likelihood: 'Medium',
    impact: 'High',
    status: 'Open'
  },
  {
    id: 'R4',
    description: 'NHS Digital stakeholder change (new IT lead)',
    ownerId: 'marcus',
    likelihood: 'Low',
    impact: 'Medium',
    status: 'Open'
  },
  {
    id: 'R5',
    description: 'Axiom Digital data migration incomplete',
    ownerId: 'jess',
    likelihood: 'Medium',
    impact: 'Medium',
    status: 'Open'
  }
];
