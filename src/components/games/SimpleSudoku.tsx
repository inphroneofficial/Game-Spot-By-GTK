import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Lightbulb, Check } from "lucide-react";
import { toast } from "sonner";

interface SimpleSudokuProps {
  onBack: () => void;
}

// Simple 4x4 Sudoku puzzles
const PUZZLES = [
  {
    puzzle: [
      [1, 0, 0, 4],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [4, 0, 0, 1]
    ],
    solution: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ]
  },
  {
    puzzle: [
      [0, 3, 0, 0],
      [0, 0, 0, 1],
      [1, 0, 0, 0],
      [0, 0, 3, 0]
    ],
    solution: [
      [2, 3, 4, 1],
      [4, 1, 2, 3],
      [1, 2, 3, 4],
      [3, 4, 1, 2]
    ]
  },
  {
    puzzle: [
      [0, 0, 2, 3],
      [0, 2, 0, 0],
      [0, 0, 1, 0],
      [2, 3, 0, 0]
    ],
    solution: [
      [1, 4, 2, 3],
      [3, 2, 4, 1],
      [4, 1, 3, 2],
      [2, 3, 1, 4]
    ]
  }
];

export const SimpleSudoku = ({ onBack }: SimpleSudokuProps) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<number[][]>([]);
  const [originalBoard, setOriginalBoard] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [completedPuzzles, setCompletedPuzzles] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    loadPuzzle();
  }, [currentPuzzleIndex]);

  const loadPuzzle = () => {
    const puzzle = PUZZLES[currentPuzzleIndex].puzzle;
    const puzzleBoard = puzzle.map(row => [...row]);
    setBoard(puzzleBoard);
    setOriginalBoard(puzzle.map(row => [...row]));
    setSelectedCell(null);
    setHintsUsed(0);
  };

  const isValidMove = (board: number[][], row: number, col: number, num: number) => {
    // Check row
    for (let c = 0; c < 4; c++) {
      if (c !== col && board[row][c] === num) return false;
    }
    
    // Check column
    for (let r = 0; r < 4; r++) {
      if (r !== row && board[r][col] === num) return false;
    }
    
    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && board[r][c] === num) return false;
      }
    }
    
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (originalBoard[row][col] !== 0) return; // Can't modify original numbers
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    if (originalBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    
    if (newBoard[row][col] === num) {
      // Remove number if clicking the same number
      newBoard[row][col] = 0;
    } else if (isValidMove(newBoard, row, col, num)) {
      newBoard[row][col] = num;
      toast("✅ Good move!");
    } else {
      toast("❌ Invalid move! Check the rules.");
      return;
    }
    
    setBoard(newBoard);
    
    // Check if puzzle is complete
    const isComplete = newBoard.every((row, r) =>
      row.every((cell, c) => cell === PUZZLES[currentPuzzleIndex].solution[r][c])
    );
    
    if (isComplete) {
      setCompletedPuzzles(prev => prev + 1);
      toast("🎉 Puzzle completed!");
      
      // Save progress
      const saved = JSON.parse(localStorage.getItem('sudoku-progress') || '{"completed": 0, "bestStreak": 0}');
      saved.completed += 1;
      localStorage.setItem('sudoku-progress', JSON.stringify(saved));
      
      setTimeout(() => {
        if (currentPuzzleIndex < PUZZLES.length - 1) {
          setCurrentPuzzleIndex(prev => prev + 1);
        } else {
          toast("🏆 All puzzles completed! Starting over...");
          setCurrentPuzzleIndex(0);
        }
      }, 2000);
    }
  };

  const useHint = () => {
    if (!selectedCell) {
      toast("Select a cell first!");
      return;
    }
    
    const { row, col } = selectedCell;
    if (originalBoard[row][col] !== 0) {
      toast("Can't hint on original numbers!");
      return;
    }
    
    const correctNumber = PUZZLES[currentPuzzleIndex].solution[row][col];
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = correctNumber;
    setBoard(newBoard);
    setHintsUsed(prev => prev + 1);
    toast(`💡 Hint: The correct number is ${correctNumber}`);
  };

  const resetPuzzle = () => {
    loadPuzzle();
  };

  const getCellColor = (row: number, col: number) => {
    if (originalBoard[row][col] !== 0) return "bg-muted text-foreground font-bold";
    if (selectedCell?.row === row && selectedCell?.col === col) return "bg-primary/20 border-2 border-primary";
    if (board[row][col] !== 0) return "bg-accent/20 text-accent font-semibold";
    return "bg-background border border-white/20 hover:bg-muted/20";
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
            <h1 className="text-3xl font-bold mb-2">Simple Sudoku</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Puzzle: {currentPuzzleIndex + 1}/{PUZZLES.length}</span>
              <span>Completed: {completedPuzzles}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={useHint}
              className="flex items-center gap-2"
              disabled={!selectedCell}
            >
              <Lightbulb className="h-4 w-4" />
              Hint
            </Button>
            <Button
              variant="outline"
              onClick={resetPuzzle}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="card-gaming p-4 mb-8 text-center">
          <p className="text-muted-foreground">
            Fill the 4×4 grid so each row, column, and 2×2 box contains numbers 1-4.
            Click a cell, then click a number below to place it.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sudoku Board */}
          <div className="card-gaming p-8">
            <div className="aspect-square max-w-sm mx-auto">
              <div className="grid grid-cols-4 gap-1 h-full">
                {board.map((row, r) =>
                  row.map((cell, c) => (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`
                        aspect-square rounded-lg
                        flex items-center justify-center
                        text-2xl transition-all duration-200
                        ${getCellColor(r, c)}
                        ${(r === 1 || r === 2) && (c === 0 || c === 1) ? 'border-r-2 border-b-2 border-white/40' : ''}
                        ${(r === 1 || r === 2) && (c === 2 || c === 3) ? 'border-l-2 border-b-2 border-white/40' : ''}
                        ${(r === 0 || r === 1) && (c === 0 || c === 1) ? 'border-r-2 border-t-2 border-white/40' : ''}
                        ${(r === 0 || r === 1) && (c === 2 || c === 3) ? 'border-l-2 border-t-2 border-white/40' : ''}
                      `}
                    >
                      {cell !== 0 && cell}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Number Pad */}
          <div className="card-gaming p-8">
            <h3 className="text-xl font-bold mb-6 text-center">Select Number</h3>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="
                    aspect-square rounded-xl
                    bg-primary text-primary-foreground
                    text-3xl font-bold
                    hover:scale-105 transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  disabled={!selectedCell}
                >
                  {num}
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => selectedCell && handleNumberInput(0)}
                disabled={!selectedCell}
                className="flex items-center gap-2"
              >
                Clear Cell
              </Button>
            </div>

            {selectedCell && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Selected: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="card-gaming p-6 mt-8 text-center">
          <h3 className="text-lg font-bold mb-4">Progress</h3>
          <div className="flex justify-center items-center gap-4">
            {PUZZLES.map((_, index) => (
              <div
                key={index}
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
                  ${index < completedPuzzles ? 'bg-accent' : ''}
                  ${index === currentPuzzleIndex ? 'bg-primary' : ''}
                  ${index > currentPuzzleIndex && index >= completedPuzzles ? 'bg-muted/30' : ''}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};