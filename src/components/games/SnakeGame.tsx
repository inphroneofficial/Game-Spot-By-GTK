import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onBack: () => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

export const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("snake-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const generateFood = useCallback((snakeBody: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 0, y: 0 });
    setIsPlaying(false);
    setScore(0);
    setGameOver(false);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || direction.x === 0 && direction.y === 0) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        toast("💀 Game Over! Hit the wall!");
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        toast("💀 Game Over! Hit yourself!");
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem("snake-high-score", newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
        toast("🍎 Food eaten! +10 points");
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, isPlaying, gameOver, food, highScore, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  const startGame = () => {
    if (direction.x === 0 && direction.y === 0) {
      setDirection({ x: 1, y: 0 }); // Start moving right
    }
    setIsPlaying(!isPlaying);
  };

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameOver) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    // Minimum swipe distance
    if (absDeltaX < 30 && absDeltaY < 30) return;
    
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && direction.x === 0) {
        setDirection({ x: 1, y: 0 }); // Right
      } else if (deltaX < 0 && direction.x === 0) {
        setDirection({ x: -1, y: 0 }); // Left
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && direction.y === 0) {
        setDirection({ x: 0, y: 1 }); // Down
      } else if (deltaY < 0 && direction.y === 0) {
        setDirection({ x: 0, y: -1 }); // Up
      }
    }
    
    touchStartRef.current = null;
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
            <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score: {score}</span>
              <span>High Score: {highScore}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={startGame}
              className="flex items-center gap-2"
              disabled={gameOver}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              onClick={resetGame}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Board */}
        <div className="card-gaming p-4 max-w-2xl mx-auto">
          <div 
            className="grid gap-1 mx-auto touch-none select-none"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              aspectRatio: '1',
              width: '100%',
              maxWidth: '500px'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some(segment => segment.x === x && segment.y === y);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-sm
                    ${isFood ? 'bg-destructive animate-glow' : ''}
                    ${isSnake && !isHead ? 'bg-primary' : ''}
                    ${isHead ? 'bg-accent glow-accent' : ''}
                    ${!isSnake && !isFood ? 'bg-muted/20' : ''}
                  `}
                />
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p className="mb-2">🖥️ <strong>PC:</strong> Use arrow keys • Space to pause/play</p>
          <p>📱 <strong>Mobile:</strong> Swipe to control direction • Tap pause button</p>
        </div>

        {gameOver && (
          <div className="text-center mt-8 animate-bounce-in">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              💀 Game Over!
            </h2>
            <p className="text-muted-foreground mb-4">
              Final Score: {score}
            </p>
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