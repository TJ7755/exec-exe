/**
 * Email Choice Component (Type B)
 * Renders inline in Outbox reading pane below email body
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogueChoice, DialogueOption } from '../../player/types';
import { resolveChoice } from '../../player/dialogueStore';
import { blockDialogue, unblockDialogue } from '../../player/gameTime';
import { setMultipleHiddenFlags } from '../../player/hiddenState';
import { updateStats } from '../../player/store';
import { getNPCResponse } from '../../scenarios/npcResponses';
import { useScenario } from '../../scenarios/engine';
import './dialogue.scss';

interface EmailChoiceProps {
  dialogue: DialogueChoice;
  emailSubject: string;
  onReply: (content: string) => void;
  onResolved?: () => void;
}

export const EmailChoice: React.FC<EmailChoiceProps> = ({
  dialogue,
  emailSubject,
  onReply,
  onResolved
}) => {
  const dispatch = useDispatch();
  const { scenario } = useScenario();
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

    // Show unlock info if present
    if (consequences.unlockInfo) {
      setShowUnlockInfo(consequences.unlockInfo);
    }

    // Trigger follow-up events
    if (consequences.triggerEventIds) {
      consequences.triggerEventIds.forEach(eventId => {
        dispatch({ type: 'SCHEDULE_EVENT', payload: eventId });
      });
    }

    // Add reply to email thread
    onReply(option.label);

    // Resolve the choice in store
    dispatch(resolveChoice(dialogue.id, option.id));

    // Call onResolved callback
    setTimeout(() => {
      onResolved?.();
    }, 100);
  }, [dispatch, dialogue, onReply, onResolved, isResolving]);

  return (
    <div className="email-choice">
      <div className="email-choice-divider" />
      
      <div className="email-choice-prompt">
        <p className="email-choice-question">How do you respond?</p>
      </div>

      {/* Choice Buttons */}
      <div className="dialogue-options email-options">
        {dialogue.options.map((option) => (
          <button
            key={option.id}
            className="dialogue-option-btn email-option"
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

      {/* Unlock Info */}
      {showUnlockInfo && (
        <div className="dialogue-unlock-info visible email-unlock">
          <span className="unlock-label">You learned:</span>
          <span className="unlock-text">{showUnlockInfo}</span>
        </div>
      )}

      {/* Archive button remains available */}
      <div className="email-choice-actions">
        <span className="email-choice-hint">Choose a response above</span>
      </div>
    </div>
  );
};

export default EmailChoice;
