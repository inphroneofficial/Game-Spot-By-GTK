import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Shuffle } from "lucide-react";
import { toast } from "sonner";

interface PuzzleSliderProps {
  onBack: () => void;
}

export const PuzzleSlider = ({ onBack }: PuzzleSliderProps) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameTime, setGameTime] = useState(0);

  const GRID_SIZE = 3;
  const TILE_COUNT = GRID_SIZE * GRID_SIZE;

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (startTime && !isComplete) {
      timer = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, isComplete]);

  const initializePuzzle = () => {
    const initialTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    shuffleTiles(initialTiles);
  };

  const shuffleTiles = (tilesArray: number[]) => {
    const shuffled = [...tilesArray];
    
    // Perform 100 random valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const validMoves = getValidMoves(emptyIndex);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
      }
    }
    
    setTiles(shuffled);
    setMoves(0);
    setIsComplete(false);
    setStartTime(0);
    setGameTime(0);
  };

  const getValidMoves = (emptyIndex: number) => {
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;
    const moves = [];

    // Up
    if (row > 0) moves.push((row - 1) * GRID_SIZE + col);
    // Down
    if (row < GRID_SIZE - 1) moves.push((row + 1) * GRID_SIZE + col);
    // Left
    if (col > 0) moves.push(row * GRID_SIZE + (col - 1));
    // Right
    if (col < GRID_SIZE - 1) moves.push(row * GRID_SIZE + (col + 1));

    return moves;
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      
      setTiles(newTiles);
      setMoves(prev => prev + 1);

      // Check if puzzle is complete
      const isWon = newTiles.every((tile, i) => tile === i);
      if (isWon) {
        setIsComplete(true);
        toast("🎉 Puzzle completed!");
        
        // Save best time
        const savedData = JSON.parse(localStorage.getItem('puzzle-slider-best') || '{"bestMoves": 999, "bestTime": 999}');
        if (moves + 1 < savedData.bestMoves || (moves + 1 === savedData.bestMoves && gameTime < savedData.bestTime)) {
          savedData.bestMoves = moves + 1;
          savedData.bestTime = gameTime;
          localStorage.setItem('puzzle-slider-best', JSON.stringify(savedData));
          toast("🏆 New best score!");
        }
      }
    }
  };

  const getTileColor = (tile: number) => {
    if (tile === 0) return "bg-muted/20";
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
    ];
    return colors[tile - 1];
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
            <h1 className="text-3xl font-bold mb-2">Puzzle Slider</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Moves: {moves}</span>
              <span>Time: {gameTime}s</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => shuffleTiles(Array.from({ length: TILE_COUNT }, (_, i) => i))}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
            <Button
              variant="outline"
              onClick={initializePuzzle}
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
            Arrange the numbers 1-8 in order. Click tiles adjacent to the empty space to move them.
          </p>
        </div>

        {/* Game Board */}
        <div className="card-gaming p-8">
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-2 aspect-square">
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={tile === 0 || isComplete}
                  className={`
                    aspect-square rounded-lg
                    flex items-center justify-center
                    text-2xl font-bold text-white
                    transition-all duration-200
                    ${getTileColor(tile)}
                    ${tile !== 0 ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                    ${tile !== 0 && !isComplete ? 'hover:shadow-lg' : ''}
                    disabled:cursor-default
                  `}
                >
                  {tile !== 0 && tile}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Display */}
        <div className="card-gaming p-6 mt-8">
          <h3 className="text-lg font-bold mb-4 text-center">Goal:</h3>
          <div className="max-w-48 mx-auto">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: TILE_COUNT }, (_, i) => (
                <div
                  key={i}
                  className={`
                    aspect-square rounded text-xs
                    flex items-center justify-center
                    font-bold text-white
                    ${i === TILE_COUNT - 1 ? 'bg-muted/20' : getTileColor(i + 1)}
                  `}
                >
                  {i !== TILE_COUNT - 1 && i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isComplete && (
          <div className="text-center mt-8 animate-bounce-in">
            <h2 className="text-2xl font-bold text-accent mb-4">
              🎉 Puzzle Complete!
            </h2>
            <p className="text-muted-foreground mb-4">
              Solved in {moves} moves and {gameTime} seconds!
            </p>
            <Button
              className="btn-gaming"
              onClick={initializePuzzle}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};