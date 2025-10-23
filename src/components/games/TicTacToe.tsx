import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, User, Bot } from "lucide-react";
import { toast } from "sonner";

type Player = 'X' | 'O' | null;
type GameResult = 'X' | 'O' | 'draw' | null;
type Board = Player[];

interface TicTacToeProps {
  onBack: () => void;
}

export const TicTacToe = ({ onBack }: TicTacToeProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<GameResult>(null);
  const [gameMode, setGameMode] = useState<'human' | 'ai'>('human');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  useEffect(() => {
    const savedScores = localStorage.getItem('tictactoe-scores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): GameResult => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'draw';
  };

  const makeMove = (index: number, player: 'X' | 'O') => {
    if (board[index] || winner) return false;
    
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      const newScores = { ...scores };
      if (gameWinner === 'draw') {
        newScores.draws++;
        toast("🤝 It's a draw!");
      } else {
        newScores[gameWinner]++;
        toast(`🎉 Player ${gameWinner} wins!`);
      }
      setScores(newScores);
      localStorage.setItem('tictactoe-scores', JSON.stringify(newScores));
    }
    
    return true;
  };

  const handleCellClick = (index: number) => {
    if (makeMove(index, currentPlayer)) {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // Enhanced AI for single-player mode
  const makeAIMove = () => {
    if (winner || currentPlayer === 'X') return;
    
    const availableMoves = board.map((cell, index) => cell === null ? index : null)
                                .filter(val => val !== null) as number[];
    
    if (availableMoves.length === 0) return;
    
    // Priority 1: Win if possible
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') {
        setTimeout(() => {
          if (makeMove(move, 'O')) {
            setCurrentPlayer('X');
          }
        }, 500);
        return;
      }
    }
    
    // Priority 2: Block player's winning move
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') {
        setTimeout(() => {
          if (makeMove(move, 'O')) {
            setCurrentPlayer('X');
          }
        }, 500);
        return;
      }
    }
    
    // Priority 3: Take center if available
    if (availableMoves.includes(4)) {
      setTimeout(() => {
        if (makeMove(4, 'O')) {
          setCurrentPlayer('X');
        }
      }, 500);
      return;
    }
    
    // Priority 4: Take corners
    const corners = [0, 2, 6, 8].filter(corner => availableMoves.includes(corner));
    if (corners.length > 0) {
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      setTimeout(() => {
        if (makeMove(randomCorner, 'O')) {
          setCurrentPlayer('X');
        }
      }, 500);
      return;
    }
    
    // Priority 5: Take any available spot
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    setTimeout(() => {
      if (makeMove(randomMove, 'O')) {
        setCurrentPlayer('X');
      }
    }, 500);
  };

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner) {
      makeAIMove();
    }
  }, [currentPlayer, gameMode, winner]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Tic-Tac-Toe</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>X: {scores.X}</span>
              <span>O: {scores.O}</span>
              <span>Draws: {scores.draws}</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={resetGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Game Mode Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={gameMode === 'human' ? 'default' : 'outline'}
            onClick={() => {
              setGameMode('human');
              resetGame();
            }}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            vs Human
          </Button>
          <Button
            variant={gameMode === 'ai' ? 'default' : 'outline'}
            onClick={() => {
              setGameMode('ai');
              resetGame();
            }}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            vs AI
          </Button>
        </div>

        {/* Current Player */}
        {!winner && (
          <div className="text-center mb-6">
            <p className="text-lg text-muted-foreground">
              Current Player: <span className="text-primary font-bold">{currentPlayer}</span>
              {gameMode === 'ai' && currentPlayer === 'O' && " (AI thinking...)"}
            </p>
          </div>
        )}

        {/* Game Board */}
        <div className="max-w-md mx-auto">
          <Card className="card-gaming p-6">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-2">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={!!cell || !!winner || (gameMode === 'ai' && currentPlayer === 'O')}
                    className={`
                      aspect-square rounded-lg border-2 border-white/20 
                      bg-muted/20 hover:bg-muted/40 
                      flex items-center justify-center
                      text-4xl font-bold transition-all duration-200
                      ${cell === 'X' ? 'text-primary animate-bounce-in' : ''}
                      ${cell === 'O' ? 'text-accent animate-bounce-in' : ''}
                      ${!cell && !winner ? 'cursor-pointer' : ''}
                      disabled:cursor-not-allowed
                    `}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Winner Display */}
        {winner && (
          <div className="text-center mt-8 animate-bounce-in">
            <h2 className="text-2xl font-bold mb-4">
              {winner === 'draw' ? (
                <span className="text-muted-foreground">🤝 It's a Draw!</span>
              ) : (
                <span className={winner === 'X' ? 'text-primary' : 'text-accent'}>
                  🎉 Player {winner} Wins!
                </span>
              )}
            </h2>
            <Button
              className="btn-gaming"
              onClick={resetGame}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};