/**
 * Dialogue Choice Component
 * Part 3 — Dialogue Choice System
 * 
 * Renders as a chat-style bubble with choice buttons beneath.
 * Once a choice is made:
 * - Buttons disappear
 * - A "sent" message appears with the chosen label's text as the player's reply
 * - Consequences apply immediately to store
 * - onResolved fires
 * 
 * Choices block game time advancement — the ticker pauses while a DialogueChoice
 * is unresolved. Resume on resolution.
 * 
 * AI_HOOK: when AI is integrated, the option list becomes a constraint set passed
 * to the model. The fallbackContent field is critical for when AI is unavailable.
 */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogueChoiceProps, ResolvedDialogue, DialogueState } from './types';
import { setHiddenFlag, setMultipleHiddenFlags, HiddenState } from '../../player/hiddenState';
import { updateStats, addNotification } from '../../player/store';
import { pauseGameTime, resumeGameTime } from '../../player/gameTime';
import { selectDialogueState, setActiveDialogue, addResolvedDialogue } from '../../player/dialogueStore';
// Note: dialogueStore exports are in src/player/dialogueStore.ts
import './dialogue.scss';

export const DialogueChoice: React.FC<DialogueChoiceProps> = ({
  npcId,
  prompt,
  options,
  onResolved,
  context = 'flack',
  threadId,
  allowTypedResponse = false
}) => {
  const dispatch = useDispatch();
  const dialogueState = useSelector(selectDialogueState) as DialogueState;
  const isActive = dialogueState.activeDialogue !== null;

  // Apply consequences when an option is chosen
  const applyConsequences = useCallback((consequences: DialogueChoiceProps['options'][0]['consequences']) => {
    // Apply stat deltas
    if (consequences.statDeltas) {
      dispatch(updateStats(consequences.statDeltas));
    }

    // Apply reputation deltas (these would need to be handled via reputation system)
    if (consequences.repDeltas) {
      // Convert rep deltas to player stats updates
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
      dispatch(setMultipleHiddenFlags(consequences.hiddenFlags));
    }

    // Trigger follow-up event if specified
    if (consequences.triggerEventId) {
      // This will be handled by the event scheduler
      // Dispatch a special action that the scheduler listens for
      dispatch({ type: 'SCHEDULE_EVENT', payload: consequences.triggerEventId });
    }
  }, [dispatch]);

  // Handle option selection
  const handleSelect = useCallback((optionId: string) => {
    const selectedOption = options.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Apply consequences immediately
    applyConsequences(selectedOption.consequences);

    // Store the resolved dialogue for AI integration
    const resolved: ResolvedDialogue = {
      id: `dialogue-${Date.now()}`,
      npcId,
      prompt,
      options,  // Store full option set for AI
      chosenOptionId: optionId,
      timestamp: new Date().toISOString(),
      isAiGenerated: false,
      fallbackContent: selectedOption.label
    };
    dispatch(addResolvedDialogue(resolved));

    // Clear active dialogue
    dispatch(setActiveDialogue(null));

    // Resume game time
    dispatch(resumeGameTime());

    // Call onResolved callback
    onResolved(optionId, selectedOption);
  }, [dispatch, npcId, prompt, options, onResolved, applyConsequences]);

  // Pause game time when dialogue becomes active
  React.useEffect(() => {
    if (!isActive) {
      dispatch(pauseGameTime());
      dispatch(setActiveDialogue({ npcId, prompt, options, onResolved, context, threadId, allowTypedResponse }));
    }
  }, [dispatch, isActive, npcId, prompt, options, onResolved, context, threadId, allowTypedResponse]);

  // Get context-specific styles
  const getContextClass = () => {
    switch (context) {
      case 'outbox': return 'dialogue-outbox';
      case 'flack': return 'dialogue-flack';
      case 'terminal': return 'dialogue-terminal';
      default: return 'dialogue-system';
    }
  };

  return (
    <div className={`dialogue-choice-container ${getContextClass()}`}>
      {/* NPC Prompt */}
      <div className="dialogue-prompt">
        <div className="dialogue-npc-avatar">
          {/* Avatar will be rendered by parent based on npcId */}
        </div>
        <div className="dialogue-bubble">
          <p className="dialogue-text">{prompt}</p>
        </div>
      </div>

      {/* Unlock Info (if any option has it) */}
      {options.some(o => o.consequences.unlockInfo) && (
        <div className="dialogue-unlock-info">
          <span className="unlock-label">You learned:</span>
          {/* Show unlock info after selection */}
        </div>
      )}

      {/* Choice Buttons */}
      <div className="dialogue-options">
        {options.map((option) => (
          <button
            key={option.id}
            className="dialogue-option-btn"
            onClick={() => handleSelect(option.id)}
          >
            <span className="option-label">{option.label}</span>
            {option.subtext && (
              <span className="option-subtext">{option.subtext}</span>
            )}
          </button>
        ))}
      </div>

      {/* AI_HOOK: Typed response option (disabled until AI integration) */}
      {allowTypedResponse && (
        <div className="dialogue-typed-response">
          <span className="typed-hint">Or type your own response...</span>
        </div>
      )}
    </div>
  );
};

// Render a resolved dialogue (player's choice)
export const ResolvedDialogueView: React.FC<{
  resolved: ResolvedDialogue;
  showUnlockInfo?: string;
}> = ({ resolved, showUnlockInfo }) => {
  const chosenOption = resolved.options.find(o => o.id === resolved.chosenOptionId);

  return (
    <div className="dialogue-resolved">
      <div className="dialogue-player-reply">
        <div className="dialogue-bubble player">
          <p>{chosenOption?.label || resolved.fallbackContent}</p>
        </div>
      </div>
      
      {showUnlockInfo && (
        <div className="dialogue-unlock-info visible">
          <span className="unlock-label">You learned:</span>
          <span className="unlock-text">{showUnlockInfo}</span>
        </div>
      )}
    </div>
  );
};

export default DialogueChoice;
