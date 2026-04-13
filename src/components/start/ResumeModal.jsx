import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "../../utils/general";
import { resetGame, selectSaveGameInfo } from "../../player/store";
import { gameMinutesToGameTime } from "../../player/gameTime";

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const ResumeModal = ({ onResume, onClose }) => {
  const dispatch = useDispatch();
  const saveInfo = useSelector(selectSaveGameInfo);

  const handleResume = () => {
    onResume?.();
    onClose?.();
  };

  const handleRestart = () => {
    if (confirm("Are you sure? This will erase all progress and start a new game.")) {
      dispatch(resetGame());
      onClose?.();
    }
  };

  const dayName = DAY_NAMES[saveInfo.day] || 'Monday';
  const timeStr = gameMinutesToGameTime(saveInfo.gameTime);

  return (
    <div className="resume-modal-overlay">
      <div className="resume-modal-backdrop" />
      <div className="resume-modal-content">
        <div className="resume-modal-avatar">
          <img src="img/asset/stickman.svg" alt="User avatar" />
        </div>

        <h1 className="resume-modal-title">Welcome back, {saveInfo.playerName}</h1>

        <div className="resume-modal-save-info">
          <div className="resume-modal-save-label">Current Session</div>
          <div className="resume-modal-save-details">
            <span className="resume-modal-day">{dayName}</span>
            <span className="resume-modal-time">{timeStr}</span>
          </div>
        </div>

        <div className="resume-modal-actions">
          <button
            className="resume-modal-btn resume-modal-btn--primary"
            onClick={handleResume}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Resume Game
          </button>

          <button
            className="resume-modal-btn resume-modal-btn--secondary"
            onClick={handleRestart}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12a9 9 0 1 1 9 9M3 12V3h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
