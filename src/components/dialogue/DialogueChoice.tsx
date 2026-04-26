import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DialogueChoice as StoredChoice, DialogueChoiceProps, DialogueOption, ResolvedDialogue } from './types';
import { setMultipleHiddenFlags } from '../../player/hiddenState';
import { updateStats } from '../../player/store';
import { blockDialogue, unblockDialogue } from '../../player/gameTime';
import { addResolvedDialogue } from '../../player/dialogueStore';
import './dialogue.scss';

type LegacyProps = DialogueChoiceProps;
type StoredChoiceProps = {
  choice: StoredChoice;
  onResolve?: (optionId: string, option: DialogueOption) => void;
};
type DialogueChoiceComponentProps = LegacyProps | StoredChoiceProps;

const isStoredChoiceProps = (props: DialogueChoiceComponentProps): props is StoredChoiceProps =>
  (props as StoredChoiceProps).choice !== undefined;

export const DialogueChoice: React.FC<DialogueChoiceComponentProps> = (props) => {
  const dispatch = useDispatch();

  const storedMode = isStoredChoiceProps(props);
  const options = storedMode ? props.choice.options : props.options;
  const prompt = storedMode ? (props.choice.prompt || '') : props.prompt;
  const npcId = storedMode ? props.choice.contextId : props.npcId;
  const isResolved = storedMode ? props.choice.resolvedOptionId !== null : false;
  const context = storedMode ? 'terminal' : (props.context || 'flack');

  const applyConsequences = useCallback((consequences: DialogueOption['consequences']) => {
    if (consequences.statDeltas) {
      dispatch(updateStats(consequences.statDeltas));
    }

    if (consequences.repDeltas) {
      dispatch(updateStats({
        reputation: Object.entries(consequences.repDeltas).map(([targetNpcId, score]) => ({
          npcId: targetNpcId,
          score
        }))
      }));
    }

    if (consequences.hiddenFlags) {
      dispatch(setMultipleHiddenFlags(consequences.hiddenFlags));
    }

    const anyConsequences = consequences as any;
    if (Array.isArray(anyConsequences.triggerEventIds)) {
      anyConsequences.triggerEventIds.forEach((eventId: string) => {
        dispatch({ type: 'SCHEDULE_EVENT', payload: eventId });
      });
    }

    if (anyConsequences.triggerEventId) {
      dispatch({ type: 'SCHEDULE_EVENT', payload: anyConsequences.triggerEventId });
    }
  }, [dispatch]);

  const handleSelect = useCallback((optionId: string) => {
    const selectedOption = options.find(option => option.id === optionId);
    if (!selectedOption) return;

    // Stored-choice mode (ExecuTerm) is handled by the app-level resolver to avoid
    // double-applying consequences and duplicate history writes.
    if (storedMode) {
      props.onResolve?.(optionId, selectedOption);
      dispatch(unblockDialogue());
      return;
    }

    applyConsequences(selectedOption.consequences);

    const resolved: ResolvedDialogue = {
      id: `dialogue-${Date.now()}`,
      npcId,
      prompt,
      options,
      chosenOptionId: optionId,
      timestamp: new Date().toISOString(),
      isAiGenerated: false,
      fallbackContent: selectedOption.label
    };
    dispatch(addResolvedDialogue(resolved));

    dispatch(unblockDialogue());
    props.onResolved(optionId, selectedOption);
  }, [dispatch, storedMode, props, options, npcId, prompt, applyConsequences]);

  useEffect(() => {
    if (!isResolved) {
      dispatch(blockDialogue());
    }
    return () => {
      dispatch(unblockDialogue());
    };
  }, [dispatch, isResolved]);

  const getContextClass = () => {
    switch (context) {
      case 'outbox': return 'dialogue-outbox';
      case 'flack': return 'dialogue-flack';
      case 'terminal': return 'dialogue-terminal';
      default: return 'dialogue-system';
    }
  };

  if (isResolved) return null;

  return (
    <div className={`dialogue-choice-container ${getContextClass()}`}>
      <div className="dialogue-prompt">
        <div className="dialogue-npc-avatar" />
        <div className="dialogue-bubble">
          <p className="dialogue-text">{prompt}</p>
        </div>
      </div>

      <div className="dialogue-options">
        {options.map((option) => (
          <button
            key={option.id}
            className={`dialogue-option-btn ${option.disabled ? 'disabled' : ''}`}
            onClick={() => !option.disabled && handleSelect(option.id)}
            disabled={option.disabled}
          >
            <span className="option-label">{option.label}</span>
            {option.subtext && (
              <span className="option-subtext">{option.subtext}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

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
