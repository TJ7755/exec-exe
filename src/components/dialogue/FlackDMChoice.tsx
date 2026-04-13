/**
 * Flack DM Choice Component (Type A)
 * Renders inline in DM threads below NPC messages
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

interface FlackDMChoiceProps {
  dialogue: DialogueChoice;
  npcName: string;
  npcAvatarColor: string;
  onPlayerMessage: (content: string) => void;
  onNPCResponse: (content: string, delayMs: number) => void;
  onResolved?: () => void;
}

export const FlackDMChoice: React.FC<FlackDMChoiceProps> = ({
  dialogue,
  npcName,
  npcAvatarColor,
  onPlayerMessage,
  onNPCResponse,
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

    // Add player message to thread
    onPlayerMessage(option.label);

    // Resolve the choice in store
    dispatch(resolveChoice(dialogue.id, option.id));

    // Get and show NPC response after 1.5s delay
    if (consequences.npcFollowUpKey && scenario?.npcs) {
      const responseText = getNPCResponse(
        scenario.npcs,
        dialogue.contextId,
        consequences.npcFollowUpKey
      );
      onNPCResponse(responseText, 1500);
    }

    // Call onResolved callback
    setTimeout(() => {
      onResolved?.();
    }, 100);
  }, [dispatch, dialogue, scenario, onPlayerMessage, onNPCResponse, onResolved, isResolving]);

  return (
    <div className="flack-dm-choice">
      <div className="dialogue-prompt">
        <div 
          className="dialogue-npc-avatar" 
          style={{ backgroundColor: npcAvatarColor }}
        />
        <div className="dialogue-bubble">
          <p className="dialogue-text">How do you respond?</p>
        </div>
      </div>

      {/* Choice Buttons */}
      <div className="dialogue-options flack-options">
        {dialogue.options.map((option) => (
          <button
            key={option.id}
            className="dialogue-option-btn"
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
        <div className="dialogue-unlock-info visible flack-unlock">
          <span className="unlock-label">You learned:</span>
          <span className="unlock-text">{showUnlockInfo}</span>
        </div>
      )}
    </div>
  );
};

export default FlackDMChoice;
