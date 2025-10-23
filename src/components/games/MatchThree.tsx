import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MatchThreeProps {
  onBack: () => void;
}

type GameState = 'menu' | 'playing' | 'gameOver';
type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'special';

interface Gem {
  type: GemType;
  x: number;
  y: number;
  isSelected: boolean;
  isMatched: boolean;
  isSpecial: boolean;
}

const BOARD_SIZE = 8;
const GEM_TYPES: GemType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const GEM_COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  special: 'bg-gradient-to-r from-pink-500 to-yellow-500'
};

const GEM_ICONS = {
  red: '💎',
  blue: '🔵',
  green: '💚',
  yellow: '⭐',
  purple: '🔮',
  orange: '🧡',
  special: '✨'
};

export function MatchThree({ onBack }: MatchThreeProps) {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [board, setBoard] = useState<Gem[][]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [selectedGem, setSelectedGem] = useState<{x: number, y: number} | null>(null);
  const [combo, setCombo] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('match-three-score');
    return saved ? parseInt(saved) : 0;
  });

  const getRandomGemType = (): GemType => {
    return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
  };

  const createInitialBoard = (): Gem[][] => {
    const newBoard: Gem[][] = [];
    
    for (let y = 0; y < BOARD_SIZE; y++) {
      const row: Gem[] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        let gemType: GemType;
        do {
          gemType = getRandomGemType();
        } while (
          (x >= 2 && row[x-1].type === gemType && row[x-2].type === gemType) ||
          (y >= 2 && newBoard[y-1][x].type === gemType && newBoard[y-2][x].type === gemType)
        );
        
        row.push({
          type: gemType,
          x,
          y,
          isSelected: false,
          isMatched: false,
          isSpecial: false
        });
      }
      newBoard.push(row);
    }
    
    return newBoard;
  };

  const findMatches = (board: Gem[][]): Gem[] => {
    const matches: Gem[] = [];
    const visited = new Set<string>();

    // Check horizontal matches
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE - 2; x++) {
        const current = board[y][x];
        let matchLength = 1;
        
        for (let i = x + 1; i < BOARD_SIZE && board[y][i].type === current.type; i++) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            const key = `${x + i},${y}`;
            if (!visited.has(key)) {
              matches.push(board[y][x + i]);
              visited.add(key);
            }
          }
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE - 2; y++) {
        const current = board[y][x];
        let matchLength = 1;
        
        for (let i = y + 1; i < BOARD_SIZE && board[i][x].type === current.type; i++) {
          matchLength++;
        }
        
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            const key = `${x},${y + i}`;
            if (!visited.has(key)) {
              matches.push(board[y + i][x]);
              visited.add(key);
            }
          }
        }
      }
    }

    return matches;
  };

  const dropGems = (board: Gem[][]): Gem[][] => {
    const newBoard = board.map(row => [...row]);
    
    for (let x = 0; x < BOARD_SIZE; x++) {
      const column = [];
      
      // Collect non-matched gems
      for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        if (!newBoard[y][x].isMatched) {
          column.push({ ...newBoard[y][x], y: 0 });
        }
      }
      
      // Fill empty spaces with new gems
      while (column.length < BOARD_SIZE) {
        column.push({
          type: getRandomGemType(),
          x,
          y: 0,
          isSelected: false,
          isMatched: false,
          isSpecial: false
        });
      }
      
      // Place gems back in column
      for (let i = 0; i < BOARD_SIZE; i++) {
        newBoard[BOARD_SIZE - 1 - i][x] = { ...column[i], y: BOARD_SIZE - 1 - i };
      }
    }
    
    return newBoard;
  };

  const swapGems = (board: Gem[][], pos1: {x: number, y: number}, pos2: {x: number, y: number}): Gem[][] => {
    const newBoard = board.map(row => [...row]);
    const temp = { ...newBoard[pos1.y][pos1.x] };
    
    newBoard[pos1.y][pos1.x] = { ...newBoard[pos2.y][pos2.x], x: pos1.x, y: pos1.y };
    newBoard[pos2.y][pos2.x] = { ...temp, x: pos2.x, y: pos2.y };
    
    return newBoard;
  };

  const isValidMove = (pos1: {x: number, y: number}, pos2: {x: number, y: number}): boolean => {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  const processMatches = useCallback((board: Gem[][]): { newBoard: Gem[][], matchesFound: number } => {
    let currentBoard = board.map(row => [...row]);
    let totalMatches = 0;
    let currentCombo = 0;

    const processRound = (): boolean => {
      const matches = findMatches(currentBoard);
      if (matches.length === 0) return false;

      // Mark matches
      matches.forEach(gem => {
        currentBoard[gem.y][gem.x].isMatched = true;
      });

      // Calculate score
      const matchScore = matches.length * 10 * (currentCombo + 1);
      setScore(prev => prev + matchScore);
      totalMatches += matches.length;
      currentCombo++;

      // Drop gems
      currentBoard = dropGems(currentBoard);
      
      return true;
    };

    while (processRound()) {
      // Continue processing cascading matches
    }

    if (currentCombo > 1) {
      setCombo(currentCombo);
      toast({
        title: `${currentCombo}x Combo!`,
        description: `Great chain reaction!`
      });
    }

    return { newBoard: currentBoard, matchesFound: totalMatches };
  }, [toast]);

  const handleGemClick = (x: number, y: number) => {
    if (gameState !== 'playing' || moves <= 0) return;

    if (!selectedGem) {
      setSelectedGem({ x, y });
      setBoard(prev => prev.map((row, rowY) => 
        row.map((gem, colX) => ({
          ...gem,
          isSelected: colX === x && rowY === y
        }))
      ));
    } else {
      if (selectedGem.x === x && selectedGem.y === y) {
        // Deselect
        setSelectedGem(null);
        setBoard(prev => prev.map(row => 
          row.map(gem => ({ ...gem, isSelected: false }))
        ));
      } else if (isValidMove(selectedGem, { x, y })) {
        // Valid swap
        const newBoard = swapGems(board, selectedGem, { x, y });
        const matches = findMatches(newBoard);
        
        if (matches.length > 0) {
          setMoves(prev => prev - 1);
          const { newBoard: processedBoard } = processMatches(newBoard);
          setBoard(processedBoard);
          setSelectedGem(null);
        } else {
          // Invalid move - no matches
          toast({
            title: "Invalid Move",
            description: "No matches created!"
          });
          setSelectedGem(null);
          setBoard(prev => prev.map(row => 
            row.map(gem => ({ ...gem, isSelected: false }))
          ));
        }
      } else {
        // Invalid adjacent move
        setSelectedGem({ x, y });
        setBoard(prev => prev.map((row, rowY) => 
          row.map((gem, colX) => ({
            ...gem,
            isSelected: colX === x && rowY === y
          }))
        ));
      }
    }
  };

  const startGame = () => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setScore(0);
    setMoves(30);
    setSelectedGem(null);
    setCombo(0);
    setGameState('playing');
  };

  const endGame = useCallback(() => {
    setGameState('gameOver');
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('match-three-score', score.toString());
      toast({
        title: "New Best Score!",
        description: `You scored ${score} points!`
      });
    }
  }, [score, bestScore, toast]);

  useEffect(() => {
    if (gameState === 'playing' && moves <= 0) {
      endGame();
    }
  }, [moves, gameState, endGame]);

  if (gameState === 'menu') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">💎 Gem Crusher</CardTitle>
            <div />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Match 3 or more gems to crush them!
            </p>
            {bestScore > 0 && (
              <div className="flex justify-center">
                <Badge variant="secondary">Best: {bestScore}</Badge>
              </div>
            )}
            <Button onClick={startGame} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Crushing
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
        <h2 className="text-2xl font-bold">💎 Gem Crusher</h2>
        <Button onClick={startGame} variant="outline">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">{moves}</div>
              <div className="text-xs text-muted-foreground">Moves</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">{combo > 1 ? `${combo}x` : '1x'}</div>
              <div className="text-xs text-muted-foreground">Combo</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <Card>
          <CardContent className="p-4">
            <div className="inline-block mx-auto">
              <div className="grid grid-cols-8 gap-1 p-2 bg-muted rounded-lg">
                {board.map((row, y) =>
                  row.map((gem, x) => (
                    <button
                      key={`${x}-${y}`}
                      onClick={() => handleGemClick(x, y)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200
                        ${GEM_COLORS[gem.type]}
                        ${gem.isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''}
                        ${gem.isMatched ? 'opacity-50' : 'hover:scale-105'}
                        flex items-center justify-center text-xs sm:text-sm
                      `}
                      disabled={gameState !== 'playing' || moves <= 0}
                    >
                      {GEM_ICONS[gem.type]}
                    </button>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>• Click two adjacent gems to swap them</p>
            <p>• Match 3 or more gems in a row to crush them</p>
            <p>• Create combos for bonus points</p>
            <p>• Use all your moves wisely!</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Over Modal */}
      {gameState === 'gameOver' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-center">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p>Final Score: <span className="font-bold text-2xl">{score}</span></p>
                {score === bestScore && score > 0 && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                    🏆 New Best Score!
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Button onClick={startGame} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline" className="w-full">
                  Back to Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}