/**
 * FlackDialogueChoice Component
 * Type A — Flack DM inline rendering
 * 
 * Renders inside the DM thread, below the NPC's triggering message, above the compose input.
 * The compose input is hidden while the choice is active.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogueChoice, DialogueOption, ResolvedChoice } from './types';
import { setActiveChoice, resolveChoice, addResolvedChoice } from '../../player/dialogueStore';
import { setMultipleHiddenFlags, HiddenState } from '../../player/hiddenState';
import { updateStats, addNotification, selectReputation } from '../../player/store';
import { blockDialogue, unblockDialogue, selectCurrentDay, selectCurrentGameMinutes } from '../../player/gameTime';
// import { buildNPCResponse, calculateNPCResponseDelay } from '../../scenarios/meridian/npcResponses';
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
  const [waitingForNPC, setWaitingForNPC] = useState(false);

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

  // Handle NPC follow-up response with branched reply support
  const handleNPCResponse = useCallback((
    npcId: string,
    content: string,
    delayGameMinutes: number,
    multiMessage?: boolean,
    secondaryMessage?: { content: string; delayGameMinutes: number }
  ) => {
    // Convert game minutes to real milliseconds: gameMinutes / 0.125 * 1000
    const delayMs = (delayGameMinutes / 0.125) * 1000;

    // Dispatch first NPC message after delay
    setTimeout(() => {
      dispatch({
        type: 'FLACK_ADD_DM_MESSAGE',
        payload: {
          participantId: npcId,
          message: {
            id: `${npcId}-${Date.now()}`,
            senderId: npcId,
            content,
            timestamp: new Date().toISOString(),
            edited: false
          }
        }
      });

      // Handle secondary message if multi-message is enabled
      if (multiMessage && secondaryMessage) {
        const secondaryDelayMs = (secondaryMessage.delayGameMinutes / 0.125) * 1000;
        setTimeout(() => {
          dispatch({
            type: 'FLACK_ADD_DM_MESSAGE',
            payload: {
              participantId: npcId,
              message: {
                id: `${npcId}-${Date.now()}-secondary`,
                senderId: npcId,
                content: secondaryMessage.content,
                timestamp: new Date().toISOString(),
                edited: false
              }
            }
          });
        }, secondaryDelayMs);
      }
    }, delayMs);
  }, [dispatch]);

  // Handle option selection
  const handleSelect = useCallback((optionId: string) => {
    const selectedOption = choice.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Apply consequences
    applyConsequences(selectedOption.consequences);

    // Handle NPC response if specified (new branched reply system)
    if (selectedOption.npcResponse) {
      setWaitingForNPC(true);
      handleNPCResponse(
        selectedOption.npcResponse.npcId,
        selectedOption.npcResponse.content,
        selectedOption.npcResponse.delayGameMinutes,
        selectedOption.npcResponse.multiMessage,
        selectedOption.npcResponse.secondaryMessage
      );
    }

    // Handle legacy NPC follow-up if specified
    if (selectedOption.consequences?.npcFollowUpKey) {
      // Legacy system - TODO: migrate to new npcResponse structure
      console.warn('Legacy npcFollowUpKey used - migrate to npcResponse structure');
    }

    // Check if this option has follow-up options (branching)
    if (selectedOption.followUpOptions && selectedOption.followUpOptions.length > 0) {
      // Update branch depth and path
      const newBranchDepth = (choice.branchDepth || 0) + 1;
      const newBranchPath = [...(choice.currentBranchPath || []), optionId];

      // Check if we've reached max depth
      if (choice.maxBranchDepth && newBranchDepth >= choice.maxBranchDepth) {
        // Close the branch - resolve the choice
        const resolved: ResolvedChoice = {
          choiceId: choice.id,
          chosenOptionId: optionId,
          allOptions: choice.options,
          gameDay: currentDay,
          gameMinute: currentGameMinutes,
          context: `${npcName} DM — ${choice.id}`
        };
        dispatch(addResolvedChoice(resolved));
        dispatch(resolveChoice(choice.id, optionId));
        dispatch(unblockDialogue());
        if (onResolve) {
          onResolve(optionId, selectedOption);
        }
      } else {
        // Continue the branch - update the choice with follow-up options
        const branchedChoice: DialogueChoice = {
          ...choice,
          options: selectedOption.followUpOptions,
          currentBranchPath: newBranchPath,
          branchDepth: newBranchDepth,
          resolvedOptionId: null // Reset to allow new selection
        };
        dispatch(setActiveChoice(branchedChoice));
      }
    } else {
      // No follow-up options - resolve the choice
      const resolved: ResolvedChoice = {
        choiceId: choice.id,
        chosenOptionId: optionId,
        allOptions: choice.options,
        gameDay: currentDay,
        gameMinute: currentGameMinutes,
        context: `${npcName} DM — ${choice.id}`
      };
      dispatch(addResolvedChoice(resolved));
      dispatch(resolveChoice(choice.id, optionId));
      dispatch(unblockDialogue());
      if (onResolve) {
        onResolve(optionId, selectedOption);
      }
    }

    // Handle additional NPC responses (for multi-character conversations like D1.S22)
    if (choice.additionalNPCResponses && choice.additionalNPCResponses.length > 0) {
      choice.additionalNPCResponses.forEach(npcResp => {
        handleNPCResponse(
          npcResp.npcId,
          npcResp.content,
          npcResp.delayGameMinutes,
          npcResp.multiMessage,
          npcResp.secondaryMessage
        );
      });
    }
  }, [dispatch, choice, npcName, currentDay, currentGameMinutes, onResolve, applyConsequences, handleNPCResponse]);

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
            disabled={option.disabled}
            onClick={() => handleSelect(option.id)}
            style={option.disabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
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
