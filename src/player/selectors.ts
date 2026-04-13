import { PlayerStats, Reputation, ReputationWithLabel } from './types';
import { PlayerState } from './types';

export const getReputationLabel = (score: number): string => {
  if (score >= 85) return 'Indispensable';
  if (score >= 65) return 'Trusted';
  if (score >= 50) return 'Neutral';
  if (score >= 31) return 'Strained';
  return 'Enemy';
};

export const getReputationDotColor = (label: string): string => {
  switch (label) {
    case 'Indispensable':
    case 'Trusted':
      return '#107c10'; // green
    case 'Neutral':
      return '#666666'; // grey
    case 'Strained':
      return '#ff8c00'; // amber
    case 'Enemy':
      return '#d83b01'; // red
    default:
      return '#666666';
  }
};

export const deriveReputationWithLabels = (reputation: Reputation[]): ReputationWithLabel[] => {
  return reputation.map(r => ({
    ...r,
    label: getReputationLabel(r.score)
  }));
};

export const getStressDescriptor = (stress: number): string => {
  if (stress >= 86) return 'Breaking';
  if (stress >= 71) return 'Overwhelmed';
  if (stress >= 51) return 'Stressed';
  if (stress >= 31) return 'Busy';
  return 'Composed';
};

export const getStressColor = (stress: number): string => {
  if (stress >= 71) return '#d83b01'; // red
  if (stress >= 51) return '#ff8c00'; // amber
  if (stress >= 31) return '#ffc107'; // yellow
  return '#107c10'; // green
};

export const getEnergyDescriptor = (energy: number): string => {
  if (energy >= 76) return 'Sharp';
  if (energy >= 51) return 'Fine';
  if (energy >= 26) return 'Tired';
  return 'Exhausted';
};

export const getEnergyColor = (energy: number): string => {
  if (energy >= 76) return '#107c10'; // green
  if (energy >= 51) return '#8cbd18'; // yellow-green
  if (energy >= 26) return '#ff8c00'; // amber
  return '#d83b01'; // red
};

export interface DerivedStats extends PlayerStats {
  reputationWithLabels: ReputationWithLabel[];
  stressLabel: string;
  stressColor: string;
  energyLabel: string;
  energyColor: string;
}

export const deriveStats = (stats: PlayerStats): DerivedStats => {
  return {
    ...stats,
    reputationWithLabels: deriveReputationWithLabels(stats.reputation),
    stressLabel: getStressDescriptor(stats.stress),
    stressColor: getStressColor(stats.stress),
    energyLabel: getEnergyDescriptor(stats.energy),
    energyColor: getEnergyColor(stats.energy)
  };
};
