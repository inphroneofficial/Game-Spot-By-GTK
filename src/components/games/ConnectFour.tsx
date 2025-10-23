import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ConnectFourProps {
  onBack: () => void;
}

type Player = 1 | 2;
type GameState = 'menu' | 'playing' | 'gameOver';
type Cell = 0 | 1 | 2; // 0 = empty, 1 = player 1, 2 = player 2
type GameMode = 'human' | 'ai';

const ROWS = 6;
const COLS = 7;

export function ConnectFour({ onBack }: ConnectFourProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('human');
  const [board, setBoard] = useState<Cell[][]>(() => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [isDraw, setIsDraw] = useState(false);

  const checkWinner = useCallback((board: Cell[][], lastRow: number, lastCol: number): boolean => {
    const player = board[lastRow][lastCol];
    if (player === 0) return false;

    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];

    for (const [deltaRow, deltaCol] of directions) {
      const cells: [number, number][] = [[lastRow, lastCol]];
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = lastRow + deltaRow * i;
        const newCol = lastCol + deltaCol * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          cells.push([newRow, newCol]);
        } else {
          break;
        }
      }

      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = lastRow - deltaRow * i;
        const newCol = lastCol - deltaCol * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && 
            board[newRow][newCol] === player) {
          cells.unshift([newRow, newCol]);
        } else {
          break;
        }
      }

      if (cells.length >= 4) {
        setWinningCells(cells);
        return true;
      }
    }

    return false;
  }, []);

  const dropPiece = useCallback((col: number) => {
    if (gameState !== 'playing' || winner || (gameMode === 'ai' && currentPlayer === 2)) return;

    // Find the lowest empty row in the column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col)) {
      setWinner(currentPlayer);
      setGameState('gameOver');
      toast({
        title: gameMode === 'ai' && currentPlayer === 2 ? 'AI Wins!' : `Player ${currentPlayer} Wins!`,
        description: "Four in a row achieved!"
      });
    } else if (newBoard.every(row => row.every(cell => cell !== 0))) {
      setIsDraw(true);
      setGameState('gameOver');
      toast({
        title: "It's a Draw!",
        description: "The board is full with no winner."
      });
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }, [board, currentPlayer, gameState, winner, checkWinner, toast, gameMode]);

  // AI move logic
  const makeAIMove = useCallback(() => {
    if (currentPlayer !== 2 || gameState !== 'playing' || winner) return;

    // Find available columns
    const availableCols: number[] = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === 0) {
        availableCols.push(col);
      }
    }

    if (availableCols.length === 0) return;

    // Check for winning move
    for (const col of availableCols) {
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
          row = r;
          break;
        }
      }
      if (row !== -1) {
        const testBoard = board.map(r => [...r]);
        testBoard[row][col] = 2;
        if (checkWinner(testBoard, row, col)) {
          setTimeout(() => dropPiece(col), 500);
          return;
        }
      }
    }

    // Block player's winning move
    for (const col of availableCols) {
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
          row = r;
          break;
        }
      }
      if (row !== -1) {
        const testBoard = board.map(r => [...r]);
        testBoard[row][col] = 1;
        if (checkWinner(testBoard, row, col)) {
          setTimeout(() => dropPiece(col), 500);
          return;
        }
      }
    }

    // Prefer center columns
    const centerCols = [3, 2, 4, 1, 5, 0, 6].filter(col => availableCols.includes(col));
    setTimeout(() => dropPiece(centerCols[0]), 500);
  }, [board, currentPlayer, gameState, winner, checkWinner, dropPiece]);

  React.useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && gameState === 'playing' && !winner) {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, gameState, winner, makeAIMove]);

  const startGame = () => {
    const initialBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    setBoard(initialBoard);
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setGameState('playing');
  };

  const resetGame = () => {
    startGame();
  };

  const getCellColor = (cell: Cell, row: number, col: number) => {
    const isWinning = winningCells.some(([r, c]) => r === row && c === col);
    
    if (cell === 0) return 'bg-background border-2 border-muted';
    if (cell === 1) return `bg-red-500 ${isWinning ? 'ring-4 ring-yellow-400' : ''}`;
    if (cell === 2) return `bg-yellow-500 ${isWinning ? 'ring-4 ring-yellow-400' : ''}`;
    return 'bg-background border-2 border-muted';
  };

  const getPlayerColor = (player: Player) => {
    return player === 1 ? 'text-red-500' : 'text-yellow-500';
  };

  if (gameState === 'menu') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">🔴 Connect Four</CardTitle>
            <div />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Get four pieces in a row to win!
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                variant={gameMode === 'human' ? 'default' : 'outline'}
                onClick={() => setGameMode('human')}
                className="flex items-center gap-2"
              >
                vs Human
              </Button>
              <Button
                variant={gameMode === 'ai' ? 'default' : 'outline'}
                onClick={() => setGameMode('ai')}
                className="flex items-center gap-2"
              >
                vs AI
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <span>You</span>
              </div>
              <span className="text-muted-foreground">vs</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                <span>{gameMode === 'ai' ? 'AI' : 'Player 2'}</span>
              </div>
            </div>
            <Button onClick={startGame} className="w-full">
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">🔴 Connect Four</h2>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Current Player Display */}
        {gameState === 'playing' && !winner && !isDraw && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg">
                Current Player: <span className={`font-bold ${getPlayerColor(currentPlayer)}`}>
                  {currentPlayer === 1 ? 'You' : (gameMode === 'ai' ? 'AI' : 'Player 2')}
                </span>
                {gameMode === 'ai' && currentPlayer === 2 && ' (thinking...)'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center">
              <div className="inline-block bg-blue-600 p-4 rounded-lg">
                {/* Column buttons for dropping pieces */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {Array(COLS).fill(null).map((_, col) => (
                    <Button
                      key={col}
                      onClick={() => dropPiece(col)}
                      disabled={gameState !== 'playing' || board[0][col] !== 0}
                      className="w-12 h-8 text-xs"
                      variant="secondary"
                    >
                      ↓
                    </Button>
                  ))}
                </div>
                
                {/* Game board */}
                <div className="grid grid-cols-7 gap-1">
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-12 h-12 rounded-full cursor-pointer transition-all duration-200 ${getCellColor(cell, rowIndex, colIndex)}`}
                        onClick={() => dropPiece(colIndex)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>• Click on a column to drop your piece</p>
            <p>• Get 4 pieces in a row (horizontal, vertical, or diagonal) to win</p>
            <p>• Block your opponent while building your own line</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Over Modal */}
      {gameState === 'gameOver' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center">
                {isDraw ? "It's a Draw!" : `Player ${winner} Wins!`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isDraw && winner && (
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 ${getPlayerColor(winner)}`}>
                    <div className={`w-8 h-8 rounded-full ${winner === 1 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-bold text-lg">Victory!</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Button onClick={startGame} className="w-full">Play Again</Button>
                <Button onClick={onBack} variant="outline" className="w-full">Back to Menu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}