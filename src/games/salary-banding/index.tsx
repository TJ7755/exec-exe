import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToolBar } from '../../utils/general';

const GRID_SIZE = 4;
const CELL_SIZE = 110;
const GAP = 10;

interface Tile {
  id: number;
  value: number;
  x: number;
  y: number;
  isNew?: boolean;
  merged?: boolean;
}

interface GameState {
  tiles: Tile[];
  score: number;
  gameOver: boolean;
  won: boolean;
  keepPlaying: boolean;
}

const TILE_LABELS: Record<number, string> = {};

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: '#eee4da', text: '#776e65' },
  4: { bg: '#ede0c8', text: '#776e65' },
  8: { bg: '#f2b179', text: '#f9f6f2' },
  16: { bg: '#f59563', text: '#f9f6f2' },
  32: { bg: '#f67c5f', text: '#f9f6f2' },
  64: { bg: '#f65e3b', text: '#f9f6f2' },
  128: { bg: '#edcf72', text: '#f9f6f2' },
  256: { bg: '#edcc61', text: '#f9f6f2' },
  512: { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#edc53f', text: '#f9f6f2' },
  2048: { bg: '#edc22e', text: '#f9f6f2' },
  4096: { bg: '#d4a017', text: '#f9f6f2' },
  8192: { bg: '#b8860b', text: '#f9f6f2' },
  16384: { bg: '#996515', text: '#f9f6f2' },
  32768: { bg: '#ffd700', text: '#776e65' },
};

const MERGE_MESSAGES: Record<number, string> = {};

const getRandomEmptyCell = (tiles: Tile[]): { x: number; y: number } => {
  const occupied = new Set(tiles.map((t) => `${t.x},${t.y}`));
  const empty: { x: number; y: number }[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
};

const getTileAt = (tiles: Tile[], x: number, y: number): Tile | undefined => {
  return tiles.find((t) => t.x === x && t.y === y);
};

const createInitialState = (): GameState => {
  const tiles: Tile[] = [];
  const pos1 = getRandomEmptyCell(tiles);
  tiles.push({ id: Date.now(), value: Math.random() < 0.9 ? 2 : 4, x: pos1.x, y: pos1.y, isNew: true });
  const pos2 = getRandomEmptyCell(tiles);
  tiles.push({ id: Date.now() + 1, value: Math.random() < 0.9 ? 2 : 4, x: pos2.x, y: pos2.y, isNew: true });

  return {
    tiles,
    score: 0,
    gameOver: false,
    won: false,
    keepPlaying: false,
  };
};

const checkHasMoves = (tiles: Tile[]): boolean => {
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true;
  for (const tile of tiles) {
    const neighbors = [
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x, y: tile.y - 1 },
    ];
    for (const n of neighbors) {
      if (n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE) {
        const neighbor = tiles.find((t) => t.x === n.x && t.y === n.y);
        if (neighbor && neighbor.value === tile.value) return true;
      }
    }
  }
  return false;
};

export const SalaryBanding: React.FC = () => {
  const wnapp = useSelector((state: any) => state.apps['salary-banding']);
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [lastMessage, setLastMessage] = useState<string>('');
  const [showWinModal, setShowWinModal] = useState(false);
  const [showSuperWinModal, setShowSuperWinModal] = useState(false);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState((prev) => {
      if (prev.gameOver || (prev.won && !prev.keepPlaying)) return prev;

      // Build previous value grid for movement detection
      const prevGrid: number[][] = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(0)
      );
      prev.tiles.forEach((t) => {
        prevGrid[t.x][t.y] = t.value;
      });

      const newTiles: Tile[] = [];
      let scoreIncrease = 0;
      let maxMerged = 0;

      // For each line, collect values in move order, merge, then write back
      for (let index = 0; index < GRID_SIZE; index++) {
        const lineValues: number[] = [];
        for (let i = 0; i < GRID_SIZE; i++) {
          let tile: Tile | undefined;
          if (direction === 'up') tile = getTileAt(prev.tiles, index, i);
          else if (direction === 'down') tile = getTileAt(prev.tiles, index, GRID_SIZE - 1 - i);
          else if (direction === 'left') tile = getTileAt(prev.tiles, i, index);
          else tile = getTileAt(prev.tiles, GRID_SIZE - 1 - i, index);
          if (tile) lineValues.push(tile.value);
        }

        const mergedValues: (number | null)[] = [];
        for (let i = 0; i < lineValues.length; i++) {
          if (i + 1 < lineValues.length && lineValues[i] === lineValues[i + 1]) {
            const newValue = lineValues[i] * 2;
            mergedValues.push(newValue);
            scoreIncrease += newValue;
            if (newValue > maxMerged) maxMerged = newValue;
            i++; // skip next
          } else {
            mergedValues.push(lineValues[i]);
          }
        }
        while (mergedValues.length < GRID_SIZE) mergedValues.push(null);

        // write back into coordinates according to direction
        for (let i = 0; i < GRID_SIZE; i++) {
          const val = mergedValues[i];
          if (val !== null) {
            let x: number, y: number;
            if (direction === 'up') {
              x = index; y = i;
            } else if (direction === 'down') {
              x = index; y = GRID_SIZE - 1 - i;
            } else if (direction === 'left') {
              x = i; y = index;
            } else {
              x = GRID_SIZE - 1 - i; y = index;
            }
            newTiles.push({ id: Date.now() + Math.random(), value: val, x, y });
          }
        }
      }

      // Build new grid and detect whether any value moved/changed
      const newGrid: number[][] = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(0)
      );
      newTiles.forEach((t) => (newGrid[t.x][t.y] = t.value));

      let moved = false;
      outer: for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (prevGrid[x][y] !== newGrid[x][y]) { moved = true; break outer; }
        }
      }
      if (!moved) return prev;

      const emptyCell = getRandomEmptyCell(newTiles);
      if (!emptyCell) {
        const hasMoves = checkHasMoves(newTiles);
        return {
          tiles: newTiles,
          score: prev.score + scoreIncrease,
          gameOver: !hasMoves,
          won: prev.won,
          keepPlaying: prev.keepPlaying,
        };
      }

      newTiles.push({
        id: Date.now() + Math.random(),
        value: Math.random() < 0.9 ? 2 : 4,
        x: emptyCell.x,
        y: emptyCell.y,
        isNew: true,
      });

      const newScore = prev.score + scoreIncrease;
      const won = prev.won || newTiles.some((t) => t.value === 2048);
      if (!prev.won && won) setTimeout(() => setShowWinModal(true), 100);
      if (maxMerged === 32768) setTimeout(() => setShowSuperWinModal(true), 100);
      if (MERGE_MESSAGES[maxMerged]) setLastMessage(MERGE_MESSAGES[maxMerged]);
      const hasMoves = checkHasMoves(newTiles);

      return {
        tiles: newTiles,
        score: newScore,
        gameOver: !hasMoves,
        won,
        keepPlaying: prev.keepPlaying,
      };
    });
  }, [setShowWinModal, setShowSuperWinModal, setLastMessage]);

  const newGame = () => {
    setGameState(createInitialState());
    setLastMessage('');
    setShowWinModal(false);
    setShowSuperWinModal(false);
  };

  const continueGame = () => {
    setGameState((prev) => ({ ...prev, keepPlaying: true }));
    setShowWinModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (wnapp.hide) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, wnapp.hide]);

  const handleTouchStart = (() => {
    let startX: number;
    let startY: number;

    return {
      onTouchStart: (e: React.TouchEvent) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      onTouchEnd: (e: React.TouchEvent) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const dx = endX - startX;
        const dy = endY - startY;
        const minSwipe = 50;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) > minSwipe) {
            move(dx > 0 ? 'right' : 'left');
          }
        } else {
          if (Math.abs(dy) > minSwipe) {
            move(dy > 0 ? 'down' : 'up');
          }
        }
      },
    };
  })();

  return (
    <div
      className="salaryBanding floatTab dpShad"
      data-size={wnapp.size}
      id="salary-bandingApp"
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === 'cstm' ? wnapp.dim : { width: 520, height: 660 }),
        minWidth: 480,
        minHeight: 620,
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar app={wnapp.action} icon={wnapp.icon} size={wnapp.size} name="2048: Salary Banding" bg="#f5f5f5" />
      <div className="windowScreen flex flex-col" data-dock="true" style={{ background: '#faf8ef', padding: '15px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, padding: '0 15px' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#776e65' }}>Score</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#776e65' }}>{gameState.score}</div>
          </div>
          <div>
            <button
              onClick={newGame}
              style={{
                background: '#8f7a66',
                color: '#f9f6f2',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 3,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 'bold',
                marginTop: 5,
              }}
            >
              New Game
            </button>
          </div>
        </div>

        {lastMessage && (
          <div style={{ fontSize: 13, color: '#776e65', fontStyle: 'italic', marginBottom: 10, minHeight: 20 }}>
            {lastMessage}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            width: GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * GAP,
            height: GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * GAP,
            background: '#bbada0',
            borderRadius: 6,
            padding: GAP,
            touchAction: 'none',
            margin: '0 auto',
          }}
          {...handleTouchStart}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: CELL_SIZE,
                height: CELL_SIZE,
                background: 'rgba(238, 228, 218, 0.35)',
                borderRadius: 3,
                left: (i % GRID_SIZE) * (CELL_SIZE + GAP) + GAP,
                top: Math.floor(i / GRID_SIZE) * (CELL_SIZE + GAP) + GAP,
              }}
            />
          ))}

          {gameState.tiles.map((tile) => {
            const colors = TILE_COLORS[tile.value] || { bg: '#3c3a32', text: '#f9f6f2' };
            const fontSize = tile.value >= 10000 ? 28 : tile.value >= 1000 ? 32 : tile.value >= 100 ? 36 : 42;
            return (
              <div
                key={tile.id}
                style={{
                  position: 'absolute',
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  background: colors.bg,
                  borderRadius: 3,
                  left: tile.x * (CELL_SIZE + GAP) + GAP,
                  top: tile.y * (CELL_SIZE + GAP) + GAP,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize,
                  transition: 'all 0.15s ease',
                  animation: tile.isNew ? 'pop-in 0.2s ease' : undefined,
                }}
              >
                {tile.value}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 15, fontSize: 13, color: '#776e65', padding: '0 15px' }}>
          Use arrow keys or swipe to move tiles. Merge matching numbers to reach 2048!
        </div>

        {gameState.gameOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', color: '#776e65' }}>Game Over!</div>
            <div style={{ fontSize: 18, color: '#776e65', marginTop: 10 }}>You have reached your salary ceiling.</div>
            <button
              onClick={newGame}
              style={{
                background: '#8f7a66',
                color: '#f9f6f2',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 3,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 20,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {showWinModal && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(237, 194, 46, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#f9f6f2' }}>PROMOTED TO VP</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={continueGame}
                style={{
                  background: '#8f7a66',
                  color: '#f9f6f2',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 3,
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Keep Playing
              </button>
            </div>
          </div>
        )}

        {showSuperWinModal && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 215, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#776e65', textAlign: 'center' }}>
              YOU ARE NOW A CHIEF SYNERGY OFFICER
            </div>
            <div style={{ fontSize: 16, color: '#776e65', marginTop: 10, textAlign: 'center' }}>
              This is as good as it gets.
            </div>
            <button
              onClick={() => setShowSuperWinModal(false)}
              style={{
                background: '#8f7a66',
                color: '#f9f6f2',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 3,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 20,
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SalaryBanding;
