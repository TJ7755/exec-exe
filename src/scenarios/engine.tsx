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
    const firstName = playerName?.split(' ')[0] || 'Player';
    const lastName = playerName?.split(' ').slice(1).join(' ') || 'Name';
    return createMeridianScenario(firstName, lastName);
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
