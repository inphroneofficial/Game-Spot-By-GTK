import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface Game2048Props {
  onBack: () => void;
}

type Grid = number[][];

export const Game2048 = ({ onBack }: Game2048Props) => {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'menu'>('menu');

  const createEmptyGrid = (): Grid => {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  };

  const addRandomTile = (currentGrid: Grid): Grid => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newGrid = currentGrid.map(row => [...row]);
      newGrid[randomCell[0]][randomCell[1]] = Math.random() < 0.9 ? 2 : 4;
      return newGrid;
    }
    return currentGrid;
  };

  const initializeGame = () => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameState('playing');
  };

  const moveLeft = (currentGrid: Grid): [Grid, number] => {
    let newScore = 0;
    const newGrid = currentGrid.map(row => {
      // Filter out zeros
      const filtered = row.filter(cell => cell !== 0);
      
      // Merge adjacent equal tiles
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered[i + 1] = 0;
        }
      }
      
      // Filter again and pad with zeros
      const merged = filtered.filter(cell => cell !== 0);
      return merged.concat(Array(4 - merged.length).fill(0));
    });
    
    return [newGrid, newScore];
  };

  const rotateGrid = (currentGrid: Grid): Grid => {
    const rotated = createEmptyGrid();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        rotated[i][j] = currentGrid[3 - j][i];
      }
    }
    return rotated;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameState !== 'playing') return;

    let currentGrid = grid.map(row => [...row]);
    let rotations = 0;

    // Rotate grid to make all moves equivalent to left movement
    switch (direction) {
      case 'up':
        rotations = 1;
        break;
      case 'right':
        rotations = 2;
        break;
      case 'down':
        rotations = 3;
        break;
    }

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    const [movedGrid, scoreGain] = moveLeft(currentGrid);

    // Rotate back
    let finalGrid = movedGrid;
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      finalGrid = rotateGrid(finalGrid);
    }

    // Check if anything actually moved
    const gridChanged = JSON.stringify(grid) !== JSON.stringify(finalGrid);
    
    if (gridChanged) {
      const gridWithNewTile = addRandomTile(finalGrid);
      setGrid(gridWithNewTile);
      setScore(prev => prev + scoreGain);

      // Check for 2048 tile
      if (finalGrid.some(row => row.some(cell => cell === 2048))) {
        setGameState('won');
        const savedBest = localStorage.getItem('game-2048-best');
        const bestScore = savedBest ? parseInt(savedBest) : 0;
        if (score + scoreGain > bestScore) {
          localStorage.setItem('game-2048-best', (score + scoreGain).toString());
        }
      }

      // Check for game over
      setTimeout(() => {
        const hasEmpty = gridWithNewTile.some(row => row.some(cell => cell === 0));
        if (!hasEmpty) {
          // Check if any moves are possible
          let movePossible = false;
          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              const current = gridWithNewTile[i][j];
              if ((i > 0 && gridWithNewTile[i-1][j] === current) ||
                  (i < 3 && gridWithNewTile[i+1][j] === current) ||
                  (j > 0 && gridWithNewTile[i][j-1] === current) ||
                  (j < 3 && gridWithNewTile[i][j+1] === current)) {
                movePossible = true;
                break;
              }
            }
            if (movePossible) break;
          }
          
          if (!movePossible) {
            setGameState('lost');
          }
        }
      }, 150);
    }
  }, [grid, gameState, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          move('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-orange-200 text-orange-800',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-red-400 text-white',
      2048: 'bg-red-500 text-white',
    };
    return colors[value] || 'bg-red-600 text-white';
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">🔢</div>
            <CardTitle className="text-4xl font-bold mb-2">2048</CardTitle>
            <p className="text-muted-foreground">Combine tiles to reach 2048!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>Best Score:</strong> {localStorage.getItem('game-2048-best') || 0}</p>
              <p className="text-sm text-muted-foreground">
                Use arrow keys or swipe to move tiles. When two tiles with the same number touch, they merge!
              </p>
            </div>
            <Button onClick={initializeGame} className="btn-gaming">
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="card-gaming w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Score: {score}</span>
            <span className="text-sm text-muted-foreground">
              Best: {localStorage.getItem('game-2048-best') || 0}
            </span>
          </div>
          <Button variant="outline" onClick={initializeGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-4 gap-2 bg-muted p-4 rounded-lg">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-16 h-16 rounded-md flex items-center justify-center
                      font-bold text-lg transition-all duration-150
                      ${cell === 0 ? 'bg-muted-foreground/20' : getTileColor(cell)}
                    `}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Use arrow keys or swipe to move tiles
              </p>
              
              {/* Mobile controls */}
              <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto md:hidden">
                <div></div>
                <Button variant="outline" onClick={() => move('up')}>↑</Button>
                <div></div>
                <Button variant="outline" onClick={() => move('left')}>←</Button>
                <div></div>
                <Button variant="outline" onClick={() => move('right')}>→</Button>
                <div></div>
                <Button variant="outline" onClick={() => move('down')}>↓</Button>
                <div></div>
              </div>
            </div>

            {gameState === 'won' && (
              <div className="text-center mt-6 space-y-4">
                <div className="text-2xl font-bold text-accent">🎉 You reached 2048! 🎉</div>
                <div>Final Score: {score}</div>
                <Button onClick={initializeGame} className="btn-gaming">
                  Play Again
                </Button>
              </div>
            )}

            {gameState === 'lost' && (
              <div className="text-center mt-6 space-y-4">
                <div className="text-2xl font-bold text-destructive">Game Over!</div>
                <div>Final Score: {score}</div>
                <Button onClick={initializeGame} className="btn-gaming">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};