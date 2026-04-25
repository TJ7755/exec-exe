/**
 * SmallTalk Component
 * Renders starter question buttons in Flack DM thread
 * 
 * Displays small talk options when no active DialogueChoice is present
 * and no unread/pending messages from the NPC
 */

import React from 'react';
import type { SmallTalkQuestion } from '../../player/smallTalk';
import './dialogue.scss';

interface SmallTalkProps {
  questions: SmallTalkQuestion[];
  onQuestionSelect: (question: SmallTalkQuestion) => void;
  npcName: string;
}

export const SmallTalk: React.FC<SmallTalkProps> = ({
  questions,
  onQuestionSelect,
  npcName
}) => {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="dialogue-choice-container dialogue-flack">
      <div className="dialogue-choice-header">
        <span className="choice-label">Message {npcName}</span>
      </div>

      <div className="dialogue-options">
        {questions.map((question) => (
          <button
            key={question.id}
            className="dialogue-option-btn"
            onClick={() => onQuestionSelect(question)}
          >
            <div className="option-content">
              <span className="option-label">{question.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmallTalk;
