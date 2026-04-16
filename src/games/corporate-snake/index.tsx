import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ToolBar } from '../../utils/general';
import { useScenarioSafe } from '../../scenarios/engine';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 540;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;
// Ensure the grid height matches the visible canvas rows so nothing spawns off-screen.
const GAME_HEIGHT_CELLS = GRID_SIZE;
const GAME_HEIGHT = GAME_HEIGHT_CELLS * CELL_SIZE;

interface Point {
  x: number;
  y: number;
}

interface SynergyToken {
  x: number;
  y: number;
}

interface RedTape {
  x: number;
  y: number;
  length: number;
}

interface GameState {
  snake: Point[];
  direction: 'up' | 'down' | 'left' | 'right';
  nextDirection: 'up' | 'down' | 'left' | 'right';
  token: SynergyToken;
  redTape: RedTape[];
  score: number;
  gameOver: boolean;
  started: boolean;
  lastTapeAdded: number;
}

const DEATH_MESSAGES = [
  'The org chart has collapsed.',
  'You have been restructured.',
  'This role is being made redundant.',
  'The snake has been placed on gardening leave.',
  'A consultant has recommended this outcome.',
  'Derek has been informed.',
];

const NPC_ORDER = ['jess', 'marcus', 'derek', 'sandra', 'carl', 'priya'];

export const CorporateSnake: React.FC = () => {
  const wnapp = useSelector((state: any) => state.apps['corporate-snake']);
  const playerName = useSelector((state: any) => state.player?.displayName || 'You');
  const scenario = useScenarioSafe();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>({
    snake: [{ x: 10, y: 12 }],
    direction: 'right',
    nextDirection: 'right',
    token: { x: 15, y: 12 },
    redTape: [],
    score: 0,
    gameOver: false,
    started: false,
    lastTapeAdded: 0,
  });
  const [deathMessage, setDeathMessage] = useState('');

  const getNPCColor = useCallback((npcId: string): string => {
    if (!scenario) return '#0078d4';
    const npc = scenario.getNPC(npcId);
    return npc?.avatarColour || '#0078d4';
  }, [scenario]);

  const getNPCInitial = useCallback((npcId: string): string => {
    if (!scenario) return npcId[0].toUpperCase();
    const npc = scenario.getNPC(npcId);
    return npc?.firstName[0].toUpperCase() || npcId[0].toUpperCase();
  }, [scenario]);

  const getPlayerInitial = useCallback((): string => {
    const name = playerName || 'You';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }, [playerName]);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 12 }],
      direction: 'right',
      nextDirection: 'right',
      token: { x: 15, y: 12 },
      redTape: [],
      score: 0,
      gameOver: false,
      started: true,
      lastTapeAdded: 0,
    };
    setDeathMessage('');
  }, []);

  const spawnToken = useCallback(() => {
    const state = gameStateRef.current;
    const occupied = new Set([
      ...state.snake.map((s) => `${s.x},${s.y}`),
      ...state.redTape.flatMap((t) =>
        Array.from({ length: t.length }, (_, i) => `${t.x + i},${t.y}`)
      ),
    ]);

    let x: number, y: number;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GAME_HEIGHT_CELLS);
    } while (occupied.has(`${x},${y}`));

    state.token = { x, y };
  }, []);

  const addRedTape = useCallback(() => {
    const state = gameStateRef.current;
    const occupied = new Set([
      ...state.snake.map((s) => `${s.x},${s.y}`),
      ...state.redTape.flatMap((t) =>
        Array.from({ length: t.length }, (_, i) => `${t.x + i},${t.y}`)
      ),
      `${state.token.x},${state.token.y}`,
    ]);

    let attempts = 0;
    while (attempts < 50) {
      const x = Math.floor(Math.random() * (GRID_SIZE - 3));
      const y = Math.floor(Math.random() * GAME_HEIGHT_CELLS);
      const length = Math.min(3 + Math.floor(state.score / 50), 8);

      const positions = Array.from({ length }, (_, i) => `${x + i},${y}`);
      // allow a tape that ends on the last column (x + length === GRID_SIZE is valid)
      if (positions.every((p) => !occupied.has(p)) && x + length <= GRID_SIZE) {
        state.redTape.push({ x, y, length });
        return;
      }
      attempts++;
    }
  }, []);

  const updateGame = useCallback(() => {
    const state = gameStateRef.current;
    if (!state.started || state.gameOver) return;

    state.direction = state.nextDirection;

    const head = state.snake[0];
    let newHead: Point;

    switch (state.direction) {
      case 'up':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'down':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case 'left':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'right':
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GAME_HEIGHT_CELLS
    ) {
      state.gameOver = true;
      setDeathMessage(DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
      return;
    }

    // Check self collision
    if (state.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      state.gameOver = true;
      setDeathMessage(DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
      return;
    }

    // Check red tape collision
    if (
      state.redTape.some((tape) =>
        newHead.y === tape.y &&
        newHead.x >= tape.x &&
        newHead.x < tape.x + tape.length
      )
    ) {
      state.gameOver = true;
      setDeathMessage(DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)]);
      return;
    }

    state.snake.unshift(newHead);

    // Check token collision
    if (newHead.x === state.token.x && newHead.y === state.token.y) {
      state.score += 10;
      // Add red tape every 20 points
      if (state.score - state.lastTapeAdded >= 20) {
        addRedTape();
        state.lastTapeAdded = state.score;
      }
      spawnToken();
    } else {
      state.snake.pop();
    }
  }, [spawnToken, addRedTape]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid (graph paper look)
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= GAME_HEIGHT_CELLS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw red tape
    ctx.fillStyle = '#dc3545';
    state.redTape.forEach((tape) => {
      for (let i = 0; i < tape.length; i++) {
        const x = (tape.x + i) * CELL_SIZE;
        const y = tape.y * CELL_SIZE;
        ctx.fillRect(x + 2, y + 8, CELL_SIZE - 4, CELL_SIZE - 16);
        // Draw tape ends
        ctx.beginPath();
        ctx.moveTo(x + 4, y + 8);
        ctx.lineTo(x + CELL_SIZE - 4, y + 8);
        ctx.strokeStyle = '#b02a37';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw snake (headshots)
    state.snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE;
      const y = segment.y * CELL_SIZE;
      const centerX = x + CELL_SIZE / 2;
      const centerY = y + CELL_SIZE / 2;
      const radius = CELL_SIZE / 2 - 2;

      // Get color and initial based on segment position
      let color: string;
      let initial: string;

      if (index === 0) {
        // Player head
        color = '#0078d4';
        initial = getPlayerInitial();
      } else {
        // NPC tail
        const npcIndex = ((index - 1) % NPC_ORDER.length);
        const npcId = NPC_ORDER[npcIndex];
        color = getNPCColor(npcId);
        initial = getNPCInitial(npcId);
      }

      // Draw circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw initial
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, centerX, centerY);
    });

    // Draw synergy token (gold star)
    const tokenX = state.token.x * CELL_SIZE + CELL_SIZE / 2;
    const tokenY = state.token.y * CELL_SIZE + CELL_SIZE / 2;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = tokenX + Math.cos(angle) * 8;
      const py = tokenY + Math.sin(angle) * 8;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw UI at bottom
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, GAME_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - GAME_HEIGHT);
    ctx.strokeStyle = '#ddd';
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, GAME_HEIGHT);
    ctx.stroke();

    // Score (top-right in game area)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH - 10, 25);

    // Level (top-left in game area)
    ctx.textAlign = 'left';
    ctx.fillText(`Red Tape: ${state.redTape.length}`, 10, 25);

    // Start screen
    if (!state.started) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, GAME_HEIGHT);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CORPORATE SNAKE', CANVAS_WIDTH / 2, GAME_HEIGHT / 2 - 40);

      ctx.font = '14px sans-serif';
      ctx.fillText('Use Arrow Keys or WASD to steer', CANVAS_WIDTH / 2, GAME_HEIGHT / 2 + 10);

      ctx.font = '12px sans-serif';
      ctx.fillText('Avoid the red tape. Collect synergy tokens.', CANVAS_WIDTH / 2, GAME_HEIGHT / 2 + 70);
    }

    // Game over screen
    if (state.gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, GAME_HEIGHT);

      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_WIDTH / 2, GAME_HEIGHT / 2 - 60);

      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.fillText(deathMessage || DEATH_MESSAGES[0], CANVAS_WIDTH / 2, GAME_HEIGHT / 2 - 20);
      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH / 2, GAME_HEIGHT / 2 + 20);

      ctx.font = '12px sans-serif';
      ctx.fillText('Press Space to Restart', CANVAS_WIDTH / 2, GAME_HEIGHT / 2 + 60);
    }
  }, [deathMessage, getNPCColor, getNPCInitial, getPlayerInitial]);

  const gameLoop = useCallback(() => {
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  const gameSpeed = useCallback(() => {
    const state = gameStateRef.current;
    const baseSpeed = 800;
    const speedIncrease = Math.min(state.score * 10, 600);
    return Math.max(baseSpeed - speedIncrease, 200);
  }, []);

  useEffect(() => {
    let animationId: number;
    const loop = (timestamp: number) => {
      if (timestamp - lastUpdateTimeRef.current >= gameSpeed()) {
        updateGame();
        lastUpdateTimeRef.current = timestamp;
      }
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [updateGame, gameSpeed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (wnapp.hide) return;

      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const state = gameStateRef.current;

      if (state.gameOver && e.code === 'Space') {
        e.preventDefault();
        resetGame();
        return;
      }

      if (!state.started && e.code === 'Space') {
        e.preventDefault();
        resetGame();
        return;
      }

      if (!state.started || state.gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (state.direction !== 'down') {
            state.nextDirection = 'up';
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (state.direction !== 'up') {
            state.nextDirection = 'down';
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (state.direction !== 'right') {
            state.nextDirection = 'left';
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (state.direction !== 'left') {
            state.nextDirection = 'right';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wnapp.hide, resetGame]);

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

  return (
    <div
      className="corporateSnake floatTab dpShad"
      data-size={wnapp.size}
      id="corporate-snakeApp"
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === 'cstm' ? wnapp.dim : { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="Corporate Snake" bg="#f5f5f5" />
      <div className="windowScreen flex flex-col" data-dock="true">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default CorporateSnake;
