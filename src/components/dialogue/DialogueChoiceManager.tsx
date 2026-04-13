/**
 * Dialogue Choice Manager
 * Root-level coordinator for rendering standalone (Type C) choices
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { StandaloneChoice } from './StandaloneChoice';
import { selectStandaloneChoices } from '../../player/dialogueStore';

export const DialogueChoiceManager: React.FC = () => {
  const standaloneChoices = useSelector(selectStandaloneChoices);

  // Render standalone choices as floating cards
  if (standaloneChoices.length === 0) {
    return null;
  }

  return (
    <div className="dialogue-choice-manager">
      {standaloneChoices.map((choice) => (
        <StandaloneChoice
          key={choice.id}
          dialogue={choice}
        />
      ))}
    </div>
  );
};

export default DialogueChoiceManager;
