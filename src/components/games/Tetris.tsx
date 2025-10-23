import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TetrisProps {
  onBack: () => void;
}

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

interface Position {
  x: number;
  y: number;
}

interface Piece {
  type: TetrominoType;
  blocks: Position[];
  color: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOES: Record<TetrominoType, { blocks: Position[]; color: string }> = {
  I: { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], color: 'bg-cyan-500' },
  O: { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], color: 'bg-yellow-500' },
  T: { blocks: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: 'bg-purple-500' },
  S: { blocks: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], color: 'bg-green-500' },
  Z: { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: 'bg-red-500' },
  J: { blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: 'bg-blue-500' },
  L: { blocks: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], color: 'bg-orange-500' }
};

export function Tetris({ onBack }: TetrisProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 4, y: 0 });
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);

  const getRandomPiece = (): TetrominoType => {
    const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return pieces[Math.floor(Math.random() * pieces.length)];
  };

  const createPiece = (type: TetrominoType): Piece => ({
    type,
    blocks: TETROMINOES[type].blocks,
    color: TETROMINOES[type].color
  });

  const isValidPosition = (piece: Piece, position: Position, testBoard: string[][]): boolean => {
    return piece.blocks.every(block => {
      const x = position.x + block.x;
      const y = position.y + block.y;
      return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && !testBoard[y][x];
    });
  };

  const placePiece = (piece: Piece, position: Position, board: string[][]): string[][] => {
    const newBoard = board.map(row => [...row]);
    piece.blocks.forEach(block => {
      const x = position.x + block.x;
      const y = position.y + block.y;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = piece.color;
      }
    });
    return newBoard;
  };

  const clearLines = (board: string[][]): { newBoard: string[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const cleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    return { newBoard, linesCleared: cleared };
  };

  const rotatePiece = (piece: Piece): Piece => {
    if (piece.type === 'O') return piece; // O piece doesn't rotate
    
    const rotated = piece.blocks.map(block => ({
      x: -block.y,
      y: block.x
    }));
    
    return { ...piece, blocks: rotated };
  };

  const moveDown = useCallback(() => {
    if (!currentPiece || gameState !== 'playing') return;

    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    
    if (isValidPosition(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition);
    } else {
      // Place piece and spawn new one
      const newBoard = placePiece(currentPiece, currentPosition, board);
      const { newBoard: clearedBoard, linesCleared: cleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLinesCleared(prev => prev + cleared);
      setScore(prev => prev + cleared * 100 * level);
      
      if (cleared > 0) {
        toast({ title: `${cleared} line${cleared > 1 ? 's' : ''} cleared!` });
      }
      
      // Check game over
      if (currentPosition.y <= 1) {
        setGameState('gameOver');
        return;
      }
      
      // Spawn new piece
      const newPieceType = nextPiece || getRandomPiece();
      const newPiece = createPiece(newPieceType);
      setCurrentPiece(newPiece);
      setCurrentPosition({ x: 4, y: 0 });
      setNextPiece(getRandomPiece());
    }
  }, [currentPiece, currentPosition, board, gameState, level, nextPiece, toast]);

  const move = (direction: 'left' | 'right') => {
    if (!currentPiece || gameState !== 'playing') return;

    const newPosition = {
      x: currentPosition.x + (direction === 'left' ? -1 : 1),
      y: currentPosition.y
    };

    if (isValidPosition(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition);
    }
  };

  const rotate = () => {
    if (!currentPiece || gameState !== 'playing') return;

    const rotatedPiece = rotatePiece(currentPiece);
    if (isValidPosition(rotatedPiece, currentPosition, board)) {
      setCurrentPiece(rotatedPiece);
    }
  };

  const hardDrop = () => {
    if (!currentPiece || gameState !== 'playing') return;

    let dropPosition = currentPosition;
    while (isValidPosition(currentPiece, { ...dropPosition, y: dropPosition.y + 1 }, board)) {
      dropPosition = { ...dropPosition, y: dropPosition.y + 1 };
    }
    setCurrentPosition(dropPosition);
    moveDown();
  };

  const startGame = () => {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
    setBoard(initialBoard);
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    
    const firstPiece = createPiece(getRandomPiece());
    setCurrentPiece(firstPiece);
    setCurrentPosition({ x: 4, y: 0 });
    setNextPiece(getRandomPiece());
    setGameState('playing');
  };

  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          move('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, move, moveDown, rotate, hardDrop, togglePause]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const dropInterval = Math.max(50, 1000 - (level - 1) * 100);
    const interval = setInterval(moveDown, dropInterval);
    return () => clearInterval(interval);
  }, [moveDown, gameState, level]);

  useEffect(() => {
    const newLevel = Math.floor(linesCleared / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      toast({ title: `Level ${newLevel}!`, description: "Speed increased!" });
    }
  }, [linesCleared, level, toast]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece && gameState === 'playing') {
      currentPiece.blocks.forEach(block => {
        const x = currentPosition.x + block.x;
        const y = currentPosition.y + block.y;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          displayBoard[y][x] = currentPiece.color;
        }
      });
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-muted ${cell || 'bg-background'}`}
          />
        ))}
      </div>
    ));
  };

  if (gameState === 'menu') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">🧩 Block Puzzle</CardTitle>
            <div />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Arrange falling blocks to clear lines!
            </p>
            <Button onClick={startGame} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">🧩 Block Puzzle</h2>
        <Button onClick={togglePause} variant="outline">
          {gameState === 'playing' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Game Board */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center">
                <div className="inline-block border-2 border-muted p-2">
                  {renderBoard()}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Mobile Controls */}
          <div className="md:hidden mt-4 grid grid-cols-4 gap-2">
            <Button onClick={() => move('left')} variant="outline">←</Button>
            <Button onClick={rotate} variant="outline"><RotateCw className="h-4 w-4" /></Button>
            <Button onClick={() => move('right')} variant="outline">→</Button>
            <Button onClick={hardDrop} variant="outline">↓</Button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Score:</span>
                <Badge variant="secondary">{score}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <Badge variant="secondary">{level}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Lines:</span>
                <Badge variant="secondary">{linesCleared}</Badge>
              </div>
            </CardContent>
          </Card>

          {nextPiece && (
            <Card>
              <CardHeader>
                <CardTitle>Next Piece</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="grid grid-cols-4 gap-1">
                    {Array(16).fill(null).map((_, i) => {
                      const x = i % 4;
                      const y = Math.floor(i / 4);
                      const hasBlock = nextPiece && TETROMINOES[nextPiece].blocks.some(
                        block => block.x === x && block.y === y
                      );
                      return (
                        <div
                          key={i}
                          className={`w-4 h-4 border border-muted ${
                            hasBlock ? TETROMINOES[nextPiece].color : 'bg-background'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {gameState === 'gameOver' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p>Final Score: <span className="font-bold">{score}</span></p>
                <p>Level Reached: <span className="font-bold">{level}</span></p>
                <p>Lines Cleared: <span className="font-bold">{linesCleared}</span></p>
              </div>
              <div className="space-y-2">
                <Button onClick={startGame} className="w-full">Play Again</Button>
                <Button onClick={onBack} variant="outline" className="w-full">Back to Menu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center">Game Paused</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button onClick={togglePause} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full">Back to Menu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}