/**
 * Standalone Choice Component (Type C)
 * Renders as a floating card anchored to bottom-center
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DialogueChoice, DialogueOption } from '../../player/types';
import { resolveChoice } from '../../player/dialogueStore';
import { blockDialogue, unblockDialogue } from '../../player/gameTime';
import { setMultipleHiddenFlags } from '../../player/hiddenState';
import { updateStats, addNotification } from '../../player/store';
import './dialogue.scss';

interface StandaloneChoiceProps {
  dialogue: DialogueChoice;
  onResolved?: () => void;
}

export const StandaloneChoice: React.FC<StandaloneChoiceProps> = ({
  dialogue,
  onResolved
}) => {
  const dispatch = useDispatch();
  const [isResolving, setIsResolving] = useState(false);
  const [showUnlockInfo, setShowUnlockInfo] = useState<string | null>(null);

  // Block game time when choice becomes active
  useEffect(() => {
    dispatch(blockDialogue());
    return () => {
      dispatch(unblockDialogue());
    };
  }, [dispatch]);

  // Apply consequences and resolve
  const handleSelect = useCallback((option: DialogueOption) => {
    if (isResolving) return;
    setIsResolving(true);

    const { consequences } = option;

    // Apply stat deltas
    if (consequences.statDeltas) {
      dispatch(updateStats(consequences.statDeltas));
    }

    // Apply reputation deltas
    if (consequences.repDeltas) {
      const reputation = Object.entries(consequences.repDeltas).map(([npcId, score]) => ({
        npcId,
        score
      }));
      dispatch(updateStats({ reputation }));
    }

    // Apply hidden flags
    if (consequences.hiddenFlags) {
      dispatch(setMultipleHiddenFlags(consequences.hiddenFlags));
    }

    // Show unlock info as toast notification
    if (consequences.unlockInfo) {
      dispatch(addNotification({
        title: 'You learned',
        body: consequences.unlockInfo,
        urgency: 'low',
        appId: 'system'
      }));
    }

    // Trigger follow-up events
    if (consequences.triggerEventIds) {
      consequences.triggerEventIds.forEach(eventId => {
        dispatch({ type: 'SCHEDULE_EVENT', payload: eventId });
      });
    }

    // Resolve the choice in store
    dispatch(resolveChoice(dialogue.id, option.id));

    // Show confirmation toast
    dispatch(addNotification({
      title: 'Action taken',
      body: option.label,
      urgency: 'low',
      appId: 'system'
    }));

    // Call onResolved callback
    setTimeout(() => {
      onResolved?.();
    }, 100);
  }, [dispatch, dialogue, onResolved, isResolving]);

  return (
    <div className="standalone-choice-backdrop">
      <div className="standalone-choice-card">
        {/* Prompt */}
        {dialogue.prompt && (
          <div className="standalone-choice-prompt">
            <p>{dialogue.prompt}</p>
          </div>
        )}

        {/* Choice Buttons */}
        <div className="dialogue-options standalone-options">
          {dialogue.options.map((option) => (
            <button
              key={option.id}
              className="dialogue-option-btn standalone-option"
              onClick={() => handleSelect(option)}
              disabled={isResolving}
            >
              <span className="option-label">{option.label}</span>
              {option.subtext && (
                <span className="option-subtext">{option.subtext}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandaloneChoice;
