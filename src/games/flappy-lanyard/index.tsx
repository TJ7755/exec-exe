import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ToolBar } from '../../utils/general';

// Game constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const GARY_WIDTH = 30;
const GARY_HEIGHT = 45;
const GRAVITY = 0.6;
const FLAP_STRENGTH = -6.5;
const GAP_HEIGHT = 160;
const DIVIDER_WIDTH = 60;
const BASE_SPEED = 3;

interface Divider {
  x: number;
  topHeight: number;
  passed: boolean;
}

interface GameState {
  garyY: number;
  garyVelocity: number;
  dividers: Divider[];
  score: number;
  gameSpeed: number;
  gameOver: boolean;
  started: boolean;
}

export const FlappyLanyard: React.FC = () => {
  const wnapp = useSelector((state: any) => state.apps['flappy-lanyard']);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>({
    garyY: CANVAS_HEIGHT / 2,
    garyVelocity: 0,
    dividers: [],
    score: 0,
    gameSpeed: BASE_SPEED,
    gameOver: false,
    started: false,
  });
  const frameCountRef = useRef(0);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      garyY: CANVAS_HEIGHT / 2,
      garyVelocity: 0,
      dividers: [],
      score: 0,
      gameSpeed: BASE_SPEED,
      gameOver: false,
      started: false,
    };
    frameCountRef.current = 0;
  }, []);

  const flap = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.started) {
      state.started = true;
    }
    if (!state.gameOver) {
      state.garyVelocity = FLAP_STRENGTH;
    }
  }, []);

  const updateGame = useCallback(() => {
    const state = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !state.started || state.gameOver) return;

    frameCountRef.current++;

    // Update Gary
    state.garyVelocity += GRAVITY;
    state.garyY += state.garyVelocity;

    // Check ceiling/floor collision
    if (state.garyY < 0 || state.garyY + GARY_HEIGHT > CANVAS_HEIGHT) {
      state.gameOver = true;
      return;
    }

    // Spawn dividers
    if (frameCountRef.current % 120 === 0) {
      const minTop = 50;
      const maxTop = CANVAS_HEIGHT - GAP_HEIGHT - minTop - 50;
      const topHeight = Math.floor(Math.random() * (maxTop - minTop) + minTop);
      state.dividers.push({ x: CANVAS_WIDTH, topHeight, passed: false });
    }

    // Update dividers
    for (let i = state.dividers.length - 1; i >= 0; i--) {
      const divider = state.dividers[i];
      divider.x -= state.gameSpeed;

      // Collision detection
      const garyLeft = CANVAS_WIDTH / 2 - GARY_WIDTH / 2;
      const garyRight = garyLeft + GARY_WIDTH;
      const dividerLeft = divider.x;
      const dividerRight = divider.x + DIVIDER_WIDTH;

      if (
        garyRight > dividerLeft &&
        garyLeft < dividerRight &&
        (state.garyY < divider.topHeight || state.garyY + GARY_HEIGHT > divider.topHeight + GAP_HEIGHT)
      ) {
        state.gameOver = true;
        return;
      }

      // Score increment
      if (!divider.passed && divider.x + DIVIDER_WIDTH < garyLeft) {
        divider.passed = true;
        state.score++;
        // Increase speed every 5 dividers
        if (state.score % 5 === 0) {
          state.gameSpeed += 0.5;
        }
      }

      // Remove off-screen dividers
      if (divider.x + DIVIDER_WIDTH < 0) {
        state.dividers.splice(i, 1);
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background (grey carpet pattern)
    ctx.fillStyle = '#d0d0d0';
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, 0, 1, CANVAS_HEIGHT);
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 20) {
      ctx.fillRect(0, i, CANVAS_WIDTH, 1);
    }

    // Draw motivational posters
    const posters = ['TEAMWORK', 'SYNERGY', 'PIVOT'];
    ctx.font = '8px sans-serif';
    posters.forEach((text, idx) => {
      const x = 50 + idx * 120;
      ctx.fillStyle = ['#ff9999', '#99ccff', '#99ff99'][idx];
      ctx.fillRect(x, 30, 60, 40);
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + 30, 55);
    });

    // Draw dividers
    state.dividers.forEach((divider) => {
      // Top divider
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(divider.x, 0, DIVIDER_WIDTH, divider.topHeight);

      // Bottom divider
      const bottomY = divider.topHeight + GAP_HEIGHT;
      ctx.fillRect(divider.x, bottomY, DIVIDER_WIDTH, CANVAS_HEIGHT - bottomY);

      // Potted plant on top divider
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(divider.x + 20, divider.topHeight - 10, 20, 10);
      ctx.fillStyle = '#228b22';
      ctx.beginPath();
      ctx.arc(divider.x + 30, divider.topHeight - 15, 12, 0, Math.PI * 2);
      ctx.fill();

      // Recycling bin at bottom
      ctx.fillStyle = '#2e8b57';
      ctx.fillRect(divider.x + 15, CANVAS_HEIGHT - 25, 30, 25);
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText('♻', divider.x + 25, CANVAS_HEIGHT - 8);
    });

    // Draw Gary (business card with lanyard)
    const garyX = CANVAS_WIDTH / 2 - GARY_WIDTH / 2;
    const garyY = state.garyY;

    // Rotation based on velocity
    const rotation = Math.min(Math.max(state.garyVelocity * 0.05, -0.3), 0.3);

    ctx.save();
    ctx.translate(garyX + GARY_WIDTH / 2, garyY + GARY_HEIGHT / 2);
    ctx.rotate(rotation);

    // Card body
    ctx.fillStyle = '#fff';
    ctx.fillRect(-GARY_WIDTH / 2, -GARY_HEIGHT / 2, GARY_WIDTH, GARY_HEIGHT);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(-GARY_WIDTH / 2, -GARY_HEIGHT / 2, GARY_WIDTH, GARY_HEIGHT);

    // Lanyard clip
    ctx.fillStyle = '#0078d4';
    ctx.fillRect(-8, -GARY_HEIGHT / 2 - 3, 16, 6);

    // Name text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GARY', 0, -5);
    ctx.font = '5px sans-serif';
    ctx.fillText('Meridian', 0, 5);
    ctx.fillText('Analytics', 0, 12);

    ctx.restore();

    // Draw UI
    if (!state.started) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FLAPPY LANYARD', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

      ctx.font = '14px sans-serif';
      ctx.fillText('Press Space or Tap to Begin', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);

    } else if (state.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PERFORMANCE REVIEW', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

      ctx.fillStyle = '#fff';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

      ctx.font = '12px sans-serif';
      ctx.fillText('You have been placed on a PIP.', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);


      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText('Press Space to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
    } else {
      // Draw score
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText(`${state.score}`, CANVAS_WIDTH / 2, 40);
      ctx.fillText(`${state.score}`, CANVAS_WIDTH / 2, 40);
    }
  }, []);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameStateRef.current.gameOver) {
          resetGame();
        } else {
          flap();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap, resetGame]);

  useEffect(() => {
    if (!wnapp.hide) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [wnapp.hide, gameLoop]);

  const handleCanvasClick = () => {
    if (gameStateRef.current.gameOver) {
      resetGame();
    } else {
      flap();
    }
  };

  return (
    <div
      className="flappyLanyard floatTab dpShad"
      data-size={wnapp.size}
      id="flappy-lanyardApp"
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === 'cstm' ? wnapp.dim : { width: CANVAS_WIDTH, height: CANVAS_HEIGHT + 30 }),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Flappy Lanyard"
        bg="#f5f5f5"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default FlappyLanyard;
