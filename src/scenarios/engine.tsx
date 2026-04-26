import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Scenario, NPC } from './types';
import { selectPlayerName } from '../player/store';
import { createMeridianScenario } from './meridian';

interface ScenarioContextValue {
  scenario: Scenario;
  getNPC: (id: string) => NPC | undefined;
  getPlayerName: () => string;
}

const ScenarioContext = createContext<ScenarioContextValue | null>(null);

interface ScenarioProviderProps {
  children: ReactNode;
}

export const ScenarioProvider: React.FC<ScenarioProviderProps> = ({ children }) => {
  const playerName = useSelector(selectPlayerName);

  // Create scenario dynamically based on player name
  const scenario = useMemo(() => {
    try {
      const safePlayerName = typeof playerName === 'string' ? playerName : 'Player';
      const firstName = safePlayerName.split(' ')[0] || 'Player';
      const lastName = safePlayerName.split(' ').slice(1).join(' ') || 'Name';
      return createMeridianScenario(firstName, lastName);
    } catch (e) {
      console.error('Failed to create scenario:', e);
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
          name: typeof playerName === 'string' ? playerName : 'Player',
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
  }, [playerName]);

  const getNPC = (id: string): NPC | undefined => {
    return scenario.npcs.find(npc => npc.id === id);
  };

  const getPlayerName = (): string => {
    return playerName || scenario.player.name;
  };

  const value: ScenarioContextValue = {
    scenario,
    getNPC,
    getPlayerName
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenario = (): ScenarioContextValue => {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
};

// Helper hook for accessing scenario data with safety
export const useScenarioSafe = (): ScenarioContextValue | null => {
  return useContext(ScenarioContext);
};
