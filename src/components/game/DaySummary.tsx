/**
 * Day Summary Component
 * Shows end-of-day summary with tomorrow's calendar
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameDay, setGameMinutes, resumeGameTime } from '../../player/gameTime';
import { selectDayNameFull } from '../../player/gameTime';
import './day-summary.scss';

interface CalendarItem {
  time: string;
  title: string;
}

interface DaySummaryData {
  day: number;
  title: string;
  warnings?: string[];
  reminders?: string[];
  tomorrowCalendar: CalendarItem[];
  finalMessage?: {
    senderId: string;
    body: string;
  };
}

export const DaySummary: React.FC = () => {
  const dispatch = useDispatch();
  const dayName = useSelector(selectDayNameFull);
  
  // Get summary from Redux state
  const summary = useSelector((state: any) => state.player?.daySummary);

  if (!summary) return null;

  const { day, title, warnings, reminders, tomorrowCalendar, finalMessage } = summary;

  const handleStartNextDay = () => {
    // Advance currentDay to next day
    dispatch(setGameDay(day + 1));
    // Reset currentGameMinutes to 0
    dispatch(setGameMinutes(0));
    // Unpause clock
    dispatch(resumeGameTime());
    // Clear summary
    dispatch({ type: 'HIDE_DAY_SUMMARY' });
  };

  const nextDayName = ['', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][day] || 'Next Day';

  return (
    <div className="day-summary-overlay">
      <div className="day-summary-modal">
        <h1 className="summary-title">{title}</h1>

        {warnings && warnings.length > 0 && (
          <div className="warnings-section">
            {warnings.map((warning: string, idx: number) => (
              <div key={idx} className="warning-card">
                {warning}
              </div>
            ))}
          </div>
        )}

        {reminders && reminders.length > 0 && (
          <div className="reminders-section">
            <h3>Reminders</h3>
            <ul>
              {reminders.map((reminder: string, idx: number) => (
                <li key={idx}>{reminder}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="calendar-section">
          <h3>Tomorrow's Calendar ({nextDayName})</h3>
          <div className="calendar-items">
            {tomorrowCalendar.map((item: CalendarItem, idx: number) => (
              <div key={idx} className="calendar-item">
                <span className="calendar-time">{item.time}</span>
                <span className="calendar-title">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {finalMessage && (
          <div className="final-message">
            <div className="message-sender">{finalMessage.senderId}</div>
            <div className="message-body">{finalMessage.body}</div>
          </div>
        )}

        <button className="start-next-day-btn" onClick={handleStartNextDay}>
          Start {nextDayName}
        </button>
      </div>
    </div>
  );
};

export default DaySummary;
