import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ToolBar } from '../../utils/general';
import { useScenarioSafe } from '../../scenarios/engine';

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const EMAIL_WIDTH = 140;
const EMAIL_HEIGHT = 60;
const INBOX_HEIGHT = 120;

interface Email {
  id: number;
  x: number;
  y: number;
  sender: string;
  subject: string;
  isUrgent: boolean;
  isReplyAll: boolean;
  fallSpeed: number;
}

interface GameState {
  emails: Email[];
  score: number;
  level: number;
  inboxStack: number;
  gameOver: boolean;
  started: boolean;
  emailsActioned: number;
}

const EMAIL_SUBJECTS = [
  { subject: 'Quick question', senderId: 'marcus' },
  { subject: 'Re: Re: Re: Re: Quick question', senderId: 'marcus' },
  { subject: 'Just circling back', senderId: 'derek' },
  { subject: 'ACTION REQUIRED: Vantage Update', senderId: 'derek' },
  { subject: 'FYI', senderId: 'jess' },
  { subject: 'Heads up (delete after reading)', senderId: 'jess' },
  { subject: 'Q2 Resource Allocation — URGENT', senderId: 'priya' },
  { subject: 'IT Maintenance Window', senderId: 'carl' },
  { subject: 'Calendar invite: Alignment Sync', senderId: 'sandra' },
  { subject: 'RE: RE: RE: Laptop Replacement', senderId: 'carl' },
  { subject: "Let's find some time", senderId: 'marcus' },
  { subject: 'Thoughts?', senderId: 'derek' },
  { subject: 'Important update re: parking', senderId: 'sandra' },
  { subject: 'Can we jump on a call?', senderId: 'marcus' },
];

export const InboxZero: React.FC = () => {
  const wnapp = useSelector((state: any) => state.apps['inbox-zero']);
  const scenario = useScenarioSafe();
  const [gameState, setGameState] = useState<GameState>({
    emails: [],
    score: 0,
    level: 1,
    inboxStack: 0,
    gameOver: false,
    started: false,
    emailsActioned: 0,
  });
  const [effects, setEffects] = useState<{ id: number; x: number; y: number; type: 'delete' | 'file'; points: number }[]>([]);
  const animationRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  const getSenderName = useCallback((senderId: string): string => {
    if (!scenario) return senderId;
    const npc = scenario.getNPC(senderId);
    return npc?.firstName || senderId;
  }, [scenario]);

  const getSpawnInterval = useCallback((level: number): number => {
    return Math.max(600, 2500 - (level - 1) * 200);
  }, []);

  const getFallSpeed = useCallback((level: number, isUrgent: boolean): number => {
    const baseSpeed = 1 + (level - 1) * 0.3;
    return isUrgent ? baseSpeed * 2 : baseSpeed;
  }, []);

  const spawnEmail = useCallback(() => {
    const subjectData = EMAIL_SUBJECTS[Math.floor(Math.random() * EMAIL_SUBJECTS.length)];
    const level = gameState.level;
    const canSpawnUrgent = level >= 5;
    const canSpawnReplyAll = level >= 8;

    let isUrgent = false;
    let isReplyAll = false;

    if (canSpawnUrgent && Math.random() < 0.2) {
      isUrgent = true;
    }

    if (canSpawnReplyAll && Math.random() < 0.15) {
      isReplyAll = true;
    }

    const newEmail: Email = {
      id: Date.now() + Math.random(),
      x: Math.random() * (CANVAS_WIDTH - EMAIL_WIDTH),
      y: -EMAIL_HEIGHT,
      sender: getSenderName(subjectData.senderId),
      subject: subjectData.subject,
      isUrgent,
      isReplyAll,
      fallSpeed: getFallSpeed(level, isUrgent),
    };

    setGameState((prev) => ({
      ...prev,
      emails: [...prev.emails, newEmail],
    }));
  }, [gameState.level, getSenderName, getFallSpeed]);

  const actionEmail = useCallback((emailId: number, action: 'delete' | 'file') => {
    setGameState((prev) => {
      const email = prev.emails.find((e) => e.id === emailId);
      if (!email) return prev;

      let points = action === 'delete' ? 1 : 2;
      let inboxChange = 1;

      // REPLY ALL penalty for left-click
      if (email.isReplyAll && action === 'delete') {
        points = -5;
        inboxChange = 2;
      }

      // URGENT bonus for catching
      if (email.isUrgent && action === 'file') {
        points = 3;
      }

      const newEmails = prev.emails.filter((e) => e.id !== emailId);
      const newInboxStack = Math.min(prev.inboxStack + inboxChange, 20);

      // Add visual effect
      const effect = {
        id: Date.now(),
        x: email.x + EMAIL_WIDTH / 2,
        y: email.y,
        type: action,
        points,
      };
      setEffects((prevEffects) => [...prevEffects, effect]);
      setTimeout(() => {
        setEffects((prevEffects) => prevEffects.filter((e) => e.id !== effect.id));
      }, 800);

      const newEmailsActioned = prev.emailsActioned + 1;
      const newLevel = Math.floor(newEmailsActioned / 15) + 1;

      // Check game over
      if (newInboxStack >= 20) {
        return {
          ...prev,
          emails: newEmails,
          inboxStack: newInboxStack,
          gameOver: true,
          emailsActioned: newEmailsActioned,
          level: newLevel,
        };
      }

      return {
        ...prev,
        emails: newEmails,
        score: prev.score + points,
        inboxStack: newInboxStack,
        emailsActioned: newEmailsActioned,
        level: newLevel,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      emails: [],
      score: 0,
      level: 1,
      inboxStack: 0,
      gameOver: false,
      started: true,
      emailsActioned: 0,
    });
    lastSpawnRef.current = 0;
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameState.started || gameState.gameOver) return;

    const now = Date.now();
    const spawnInterval = getSpawnInterval(gameState.level);

    if (now - lastSpawnRef.current > spawnInterval) {
      spawnEmail();
      lastSpawnRef.current = now;
    }

    setGameState((prev) => {
      const newEmails: Email[] = [];
      let inboxIncrease = 0;

      for (const email of prev.emails) {
        const newY = email.y + email.fallSpeed;

        // Check if email hit the inbox
        if (newY + EMAIL_HEIGHT > CANVAS_HEIGHT - INBOX_HEIGHT) {
          inboxIncrease++;
          // Missed urgent email penalty
          if (email.isUrgent) {
            prev.score = Math.max(0, prev.score - 1);
          }
          continue;
        }

        newEmails.push({ ...email, y: newY });
      }

      const newInboxStack = Math.min(prev.inboxStack + inboxIncrease, 20);

      if (newInboxStack >= 20 && !prev.gameOver) {
        return {
          ...prev,
          emails: newEmails,
          inboxStack: newInboxStack,
          gameOver: true,
        };
      }

      return {
        ...prev,
        emails: newEmails,
        inboxStack: newInboxStack,
      };
    });
  }, [gameState.started, gameState.gameOver, gameState.level, getSpawnInterval, spawnEmail]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 16);
    return () => clearInterval(interval);
  }, [gameLoop]);

  const handleEmailClick = (e: React.MouseEvent, emailId: number) => {
    e.preventDefault();
    const isRightClick = e.button === 2;
    actionEmail(emailId, isRightClick ? 'file' : 'delete');
  };

  return (
    <div
      className="inboxZero floatTab dpShad"
      data-size={wnapp.size}
      id="inbox-zeroApp"
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === 'cstm' ? wnapp.dim : { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }),
        minWidth: 440,
        minHeight: 600,
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="Inbox Zero" bg="#f5f5f5" />
      <div className="windowScreen flex flex-col" data-dock="true" style={{ background: '#f5f5f5' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', background: '#fff', borderBottom: '1px solid #ddd' }}>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>Score: {gameState.score}</div>
          <div style={{ fontSize: 12, color: '#666' }}>Level: {gameState.level}</div>
        </div>

        {/* Instructions */}
        <div style={{ padding: '5px 15px', background: '#f0f0f0', fontSize: 11, color: '#666' }}>
          Left-click to delete (+1), Right-click to file (+2). Avoid REPLY ALL emails!
        </div>

        {/* Game area */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #e8e8e8, #f5f5f5)',
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Emails */}
          {gameState.emails.map((email) => (
            <div
              key={email.id}
              onClick={(e) => handleEmailClick(e, email.id)}
              onContextMenu={(e) => handleEmailClick(e, email.id)}
              style={{
                position: 'absolute',
                left: email.x,
                top: email.y,
                width: EMAIL_WIDTH,
                height: EMAIL_HEIGHT,
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                padding: 8,
                cursor: 'pointer',
                userSelect: 'none',
                borderLeft: email.isUrgent ? '4px solid #ff4444' : email.isReplyAll ? '4px solid #ff8800' : '4px solid #0078d4',
                transition: 'transform 0.1s',
              }}
              onMouseDown={(e) => {
                if (e.currentTarget.style) {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (e.currentTarget.style) {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget.style) {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 'bold', color: email.isUrgent ? '#ff4444' : email.isReplyAll ? '#ff8800' : '#0078d4', marginBottom: 2 }}>
                {email.sender} {email.isUrgent && '(URGENT)'} {email.isReplyAll && '(REPLY ALL)'}
              </div>
              <div style={{ fontSize: 9, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email.subject}
              </div>
            </div>
          ))}

          {/* Effects */}
          {effects.map((effect) => (
            <div
              key={effect.id}
              style={{
                position: 'absolute',
                left: effect.x,
                top: effect.y,
                transform: 'translate(-50%, -50%)',
                fontSize: 14,
                fontWeight: 'bold',
                color: effect.type === 'delete' ? '#ff4444' : '#44ff44',
                pointerEvents: 'none',
                animation: 'float-up 0.8s ease-out forwards',
              }}
            >
              {effect.type === 'delete' ? '✕' : '✓'} {effect.points > 0 ? `+${effect.points}` : effect.points}
            </div>
          ))}

          {/* Inbox stack visualization */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: INBOX_HEIGHT,
              background: 'linear-gradient(to top, rgba(0,120,212,0.1), transparent)',
              borderTop: '2px solid #0078d4',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '0 20px',
            }}
          >
            <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: '80%' }}>
              {Array.from({ length: gameState.inboxStack }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: Math.min(100, (i + 1) * 4),
                    background: i > 15 ? '#ff4444' : '#0078d4',
                    borderRadius: 2,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
            <div style={{ position: 'absolute', bottom: 10, fontSize: 12, color: '#0078d4', fontWeight: 'bold' }}>
              Inbox: {gameState.inboxStack}/20
            </div>
          </div>

          {/* Start screen */}
          {!gameState.started && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>INBOX ZERO</div>
              <div style={{ fontSize: 14, marginBottom: 10 }}>Emails are piling up. Action them before they overflow!</div>
              <button
                onClick={startGame}
                style={{
                  background: '#0078d4',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Start
              </button>
            </div>
          )}

          {/* Game over screen */}
          {gameState.gameOver && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4444', marginBottom: 10 }}>INBOX ZERO: FAILED</div>
              <div style={{ fontSize: 16, marginBottom: 5 }}>Final Score: {gameState.score}</div>
              <div style={{ fontSize: 14, marginBottom: 5 }}>Level Reached: {gameState.level}</div>
              <div style={{ fontSize: 14, marginBottom: 5 }}>You have {gameState.inboxStack} unread emails.</div>
              <div style={{ fontSize: 14, opacity: 0.8, fontStyle: 'italic', marginBottom: 20 }}>Derek has noticed.</div>
              <button
                onClick={startGame}
                style={{
                  background: '#0078d4',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translate(-50%, -50%); opacity: 1; }
          100% { transform: translate(-50%, -150%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default InboxZero;
