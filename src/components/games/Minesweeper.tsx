import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCcw, Flag } from 'lucide-react';

interface MinesweeperProps {
  onBack: () => void;
}

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export const Minesweeper = ({ onBack }: MinesweeperProps) => {
  const GRID_SIZE = 8;
  const MINE_COUNT = 10;
  
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'menu'>('menu');
  const [minesLeft, setMinesLeft] = useState(MINE_COUNT);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGrid = () => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor counts
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (newRow >= 0 && newRow < GRID_SIZE && 
                  newCol >= 0 && newCol < GRID_SIZE && 
                  newGrid[newRow][newCol].isMine) {
                count++;
              }
            }
          }
          newGrid[row][col].neighborCount = count;
        }
      }
    }

    return newGrid;
  };

  const startGame = () => {
    setGrid(initializeGrid());
    setGameState('playing');
    setMinesLeft(MINE_COUNT);
    setTimer(0);
    setGameStarted(false);
  };

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing' || grid[row][col].isRevealed || grid[row][col].isFlagged) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newGrid = [...grid];
    
    if (newGrid[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c].isMine) {
            newGrid[r][c].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      setGameState('lost');
      return;
    }

    // Reveal cell and cascade if it's empty
    const toReveal: [number, number][] = [[row, col]];
    const visited = new Set<string>();

    while (toReveal.length > 0) {
      const [currentRow, currentCol] = toReveal.pop()!;
      const key = `${currentRow}-${currentCol}`;
      
      if (visited.has(key) || 
          currentRow < 0 || currentRow >= GRID_SIZE || 
          currentCol < 0 || currentCol >= GRID_SIZE ||
          newGrid[currentRow][currentCol].isRevealed ||
          newGrid[currentRow][currentCol].isFlagged ||
          newGrid[currentRow][currentCol].isMine) {
        continue;
      }

      visited.add(key);
      newGrid[currentRow][currentCol].isRevealed = true;

      // If it's empty (0 neighbors), reveal all neighbors
      if (newGrid[currentRow][currentCol].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            toReveal.push([currentRow + dr, currentCol + dc]);
          }
        }
      }
    }

    setGrid(newGrid);

    // Check win condition
    let revealedCount = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c].isRevealed && !newGrid[r][c].isMine) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
      setGameState('won');
      // Save best time
      const savedTime = localStorage.getItem('minesweeper-best-time');
      if (!savedTime || timer < parseInt(savedTime)) {
        localStorage.setItem('minesweeper-best-time', timer.toString());
      }
    }
  };

  const flagCell = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
    
    setMinesLeft(prev => newGrid[row][col].isFlagged ? prev - 1 : prev + 1);
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && gameStarted) {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, gameStarted]);

  const getCellDisplay = (cell: Cell, row: number, col: number) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborCount === 0) return '';
    return cell.neighborCount.toString();
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return 'bg-muted hover:bg-muted/80';
    if (cell.isMine) return 'bg-destructive';
    return 'bg-background';
  };

  const getNumberColor = (count: number) => {
    const colors = [
      '', 'text-blue-500', 'text-green-500', 'text-red-500',
      'text-purple-500', 'text-yellow-500', 'text-pink-500',
      'text-gray-500', 'text-black'
    ];
    return colors[count] || '';
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
            <div className="text-6xl mb-4 animate-bounce-in">💣</div>
            <CardTitle className="text-4xl font-bold mb-2">Minesweeper</CardTitle>
            <p className="text-muted-foreground">Find all mines using logic and deduction!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>Best Time:</strong> {localStorage.getItem('minesweeper-best-time') || 'N/A'}s</p>
              <p className="text-sm text-muted-foreground">
                8x8 grid with 10 mines. Left click to reveal, right click to flag.
              </p>
            </div>
            <Button onClick={startGame} className="btn-gaming">
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
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Flag className="w-4 h-4" />
              {minesLeft}
            </span>
            <span>Time: {timer}s</span>
          </div>
          <Button variant="outline" onClick={startGame}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-1 max-w-md mx-auto">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-8 h-8 border border-border text-sm font-bold
                    transition-colors duration-150 ${getCellColor(cell)}
                    ${getNumberColor(cell.neighborCount)}
                  `}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => flagCell(e, rowIndex, colIndex)}
                  disabled={gameState !== 'playing'}
                >
                  {getCellDisplay(cell, rowIndex, colIndex)}
                </button>
              ))
            )}
          </div>
          
          {gameState === 'won' && (
            <div className="text-center mt-6 space-y-4">
              <div className="text-2xl font-bold text-accent">🎉 You Won! 🎉</div>
              <div>Time: {timer} seconds</div>
              <Button onClick={startGame} className="btn-gaming">
                Play Again
              </Button>
            </div>
          )}
          
          {gameState === 'lost' && (
            <div className="text-center mt-6 space-y-4">
              <div className="text-2xl font-bold text-destructive">💥 Game Over 💥</div>
              <Button onClick={startGame} className="btn-gaming">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};