/**
 * FlackDialogueChoice Component
 * Type A — Flack DM inline rendering
 * 
 * Renders inside the DM thread, below the NPC's triggering message, above the compose input.
 * The compose input is hidden while the choice is active.
 */

import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogueChoice, DialogueOption, ResolvedChoice } from './types';
import { setActiveChoice, resolveChoice, addResolvedChoice } from '../../player/dialogueStore';
import { setMultipleHiddenFlags, HiddenState } from '../../player/hiddenState';
import { updateStats, addNotification, selectReputation } from '../../player/store';
import { blockDialogue, unblockDialogue, selectCurrentDay, selectCurrentGameMinutes } from '../../player/gameTime';
import { buildNPCResponse, calculateNPCResponseDelay } from '../../scenarios/meridian/npcResponses';
import './dialogue.scss';

interface FlackDialogueChoiceProps {
  choice: DialogueChoice;
  npcName: string;
  npcAvatarColour: string;
  onResolve?: (optionId: string, option: DialogueOption) => void;
}

const LETTER_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const FlackDialogueChoice: React.FC<FlackDialogueChoiceProps> = ({
  choice,
  npcName,
  npcAvatarColour,
  onResolve
}) => {
  const dispatch = useDispatch();
  const currentDay = useSelector(selectCurrentDay);
  const currentGameMinutes = useSelector(selectCurrentGameMinutes);
  const reputation = useSelector(selectReputation);

  // Pause game time when this choice becomes active
  useEffect(() => {
    if (!choice.resolvedOptionId) {
      dispatch(blockDialogue());
    }
    return () => {
      dispatch(unblockDialogue());
    };
  }, [dispatch, choice.resolvedOptionId]);

  // Apply consequences when an option is chosen
  const applyConsequences = useCallback((consequences: DialogueOption['consequences']) => {
    // Apply stat deltas
    if (consequences.statDeltas) {
      dispatch(updateStats(consequences.statDeltas));
    }

    // Apply reputation deltas
    if (consequences.repDeltas) {
      const repUpdate = {
        reputation: Object.entries(consequences.repDeltas).map(([npcId, score]) => ({
          npcId,
          score
        }))
      };
      dispatch(updateStats(repUpdate));
    }

    // Apply hidden flags
    if (consequences.hiddenFlags) {
      dispatch(setMultipleHiddenFlags(consequences.hiddenFlags as Partial<HiddenState>));
    }

    // Trigger follow-up events if specified
    if (consequences.triggerEventIds && consequences.triggerEventIds.length > 0) {
      consequences.triggerEventIds.forEach(eventId => {
        dispatch({ type: 'SCHEDULE_EVENT', payload: eventId });
      });
    }

    // Send insight as a delayed DM from Tom if present
    if (consequences.unlockInfo) {
      // Delay by 3-5 minutes (180000-300000ms) to be "slightly too late"
      const delayMinutes = 3 + Math.random() * 2;
      const delayMs = delayMinutes * 60 * 1000;
      
      setTimeout(() => {
        dispatch({
          type: 'FLACK_ADD_DM_MESSAGE',
          payload: {
            participantId: 'tom',
            message: {
              id: `tom-insight-${Date.now()}`,
              senderId: 'tom',
              content: `Oh btw, ${consequences.unlockInfo}`,
              timestamp: new Date().toISOString(),
              edited: false
            }
          }
        });
        
        dispatch(addNotification({
          title: 'New DM',
          body: 'Tom sent you a message',
          urgency: 'normal',
          appId: 'flack'
        }));
      }, delayMs);
    }
  }, [dispatch]);

  // Handle NPC follow-up response
  const handleNPCFollowUp = useCallback((
    npcId: string,
    responseKey: string,
    optionConsequences: DialogueOption['consequences']
  ) => {
    // Determine reputation tone
    const npcRep = Array.isArray(reputation) ? reputation.find((r: any) => r.npcId === npcId) : null;
    let reputationTone: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    if (npcRep) {
      if (npcRep.score >= 3) reputationTone = 'positive';
      else if (npcRep.score <= -3) reputationTone = 'negative';
    }

    // Build response
    const response = buildNPCResponse(npcId, responseKey, reputationTone);
    
    // Calculate delay
    const delay = calculateNPCResponseDelay(npcId, response.length);

    // Dispatch Flack DM message after delay
    setTimeout(() => {
      dispatch({
        type: 'FLACK_ADD_DM_MESSAGE',
        payload: {
          participantId: npcId,
          message: {
            id: `${npcId}-${Date.now()}`,
            senderId: npcId,
            content: response,
            timestamp: new Date().toISOString(),
            edited: false
          }
        }
      });
    }, delay);
  }, [dispatch, reputation]);

  // Handle option selection
  const handleSelect = useCallback((optionId: string) => {
    const selectedOption = choice.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Apply consequences
    applyConsequences(selectedOption.consequences);

    // Handle NPC follow-up if specified
    if (selectedOption.consequences?.npcFollowUpKey) {
      handleNPCFollowUp(
        choice.contextId,
        selectedOption.consequences.npcFollowUpKey,
        selectedOption.consequences
      );
    }

    // Store the resolved choice
    const resolved: ResolvedChoice = {
      choiceId: choice.id,
      chosenOptionId: optionId,
      allOptions: choice.options,
      gameDay: currentDay,
      gameMinute: currentGameMinutes,
      context: `${npcName} DM — ${choice.id}`
    };
    dispatch(addResolvedChoice(resolved));

    // Mark choice as resolved in the store
    dispatch(resolveChoice(choice.id, optionId));

    // Unblock game time
    dispatch(unblockDialogue());

    // Call onResolve callback if provided
    if (onResolve) {
      onResolve(optionId, selectedOption);
    }
  }, [dispatch, choice, npcName, currentDay, currentGameMinutes, onResolve, applyConsequences, handleNPCFollowUp]);

  // Don't render if already resolved
  if (choice.resolvedOptionId) {
    return null;
  }

  return (
    <div className="dialogue-choice-container dialogue-flack">
      <div className="dialogue-choice-header">
        <span className="choice-label">How do you respond?</span>
      </div>

      <div className="dialogue-options">
        {choice.options.map((option, index) => (
          <button
            key={option.id}
            className="dialogue-option-btn"
            onClick={() => handleSelect(option.id)}
          >
            <span className="option-letter">{LETTER_LABELS[index]}</span>
            <div className="option-content">
              <span className="option-label">{option.label}</span>
              {option.subtext && (
                <span className="option-subtext">{option.subtext}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlackDialogueChoice;
