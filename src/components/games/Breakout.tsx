import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface BreakoutProps {
  onBack: () => void;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  destroyed: boolean;
}

export const Breakout = ({ onBack }: BreakoutProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  
  const canvasWidth = 400;
  const canvasHeight = 300;
  const paddleWidth = 80;
  const paddleHeight = 10;
  const ballRadius = 8;
  const brickRows = 5;
  const brickCols = 8;
  const brickWidth = 45;
  const brickHeight = 15;
  
  const [paddleX, setPaddleX] = useState((canvasWidth - paddleWidth) / 2);
  const [ball, setBall] = useState<Ball>({
    x: canvasWidth / 2,
    y: canvasHeight - 30,
    dx: 3,
    dy: -3
  });
  
  const [bricks, setBricks] = useState<Brick[]>([]);

  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        newBricks.push({
          x: c * (brickWidth + 5) + 10,
          y: r * (brickHeight + 5) + 30,
          width: brickWidth,
          height: brickHeight,
          destroyed: false
        });
      }
    }
    setBricks(newBricks);
  }, []);

  const resetGame = useCallback(() => {
    setPaddleX((canvasWidth - paddleWidth) / 2);
    setBall({
      x: canvasWidth / 2,
      y: canvasHeight - 30,
      dx: 3 * (Math.random() > 0.5 ? 1 : -1),
      dy: -3
    });
    initializeBricks();
    setScore(0);
    setLives(3);
    setLevel(1);
  }, [initializeBricks]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const saveHighScore = (finalScore: number) => {
    const saved = localStorage.getItem('breakout-high-score');
    const highScore = saved ? parseInt(saved) : 0;
    if (finalScore > highScore) {
      localStorage.setItem('breakout-high-score', finalScore.toString());
    }
  };

  // Game logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        // Move ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;
        
        // Bounce off walls
        if (newBall.x <= ballRadius || newBall.x >= canvasWidth - ballRadius) {
          newBall.dx = -newBall.dx;
        }
        if (newBall.y <= ballRadius) {
          newBall.dy = -newBall.dy;
        }
        
        // Paddle collision
        if (newBall.y >= canvasHeight - 30 - ballRadius &&
            newBall.x >= paddleX && newBall.x <= paddleX + paddleWidth) {
          newBall.dy = -Math.abs(newBall.dy);
          // Add angle based on where ball hits paddle
          const hitPos = (newBall.x - paddleX) / paddleWidth;
          newBall.dx = 4 * (hitPos - 0.5);
        }
        
        // Ball falls off screen
        if (newBall.y > canvasHeight) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
              saveHighScore(score);
            }
            return newLives;
          });
          
          // Reset ball position
          newBall = {
            x: canvasWidth / 2,
            y: canvasHeight - 30,
            dx: 3 * (Math.random() > 0.5 ? 1 : -1),
            dy: -3
          };
        }
        
        return newBall;
      });

      // Check brick collisions
      setBricks(prevBricks => {
        const newBricks = [...prevBricks];
        let brickHit = false;
        
        for (let brick of newBricks) {
          if (!brick.destroyed &&
              ball.x >= brick.x && ball.x <= brick.x + brick.width &&
              ball.y >= brick.y && ball.y <= brick.y + brick.height) {
            brick.destroyed = true;
            brickHit = true;
            setScore(prev => prev + 10);
            break;
          }
        }
        
        if (brickHit) {
          setBall(prev => ({ ...prev, dy: -prev.dy }));
        }
        
        // Check if all bricks destroyed
        if (newBricks.every(brick => brick.destroyed)) {
          setLevel(prev => prev + 1);
          // Reset with new level
          setTimeout(() => {
            initializeBricks();
            setBall(prev => ({
              ...prev,
              dx: prev.dx * 1.1,
              dy: prev.dy * 1.1
            }));
          }, 1000);
        }
        
        return newBricks;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, ball.x, ball.y, paddleX, score, initializeBricks]);

  // Mouse movement for paddle
  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setPaddleX(Math.max(0, Math.min(canvasWidth - paddleWidth, x - paddleWidth / 2)));
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
            <div className="text-6xl mb-4 animate-bounce-in">🧱</div>
            <CardTitle className="text-4xl font-bold mb-2">Breakout</CardTitle>
            <p className="text-muted-foreground">Classic brick-breaking action!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>High Score:</strong> {localStorage.getItem('breakout-high-score') || 0}</p>
              <p className="text-sm text-muted-foreground">
                Move your paddle to keep the ball bouncing and destroy all bricks!
              </p>
            </div>
            <Button onClick={startGame} className="btn-gaming">
              <Play className="w-4 h-4 mr-2" />
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
            <span>Score: {score}</span>
            <span>Lives: {lives}</span>
            <span>Level: {level}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
          >
            {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-black rounded-lg mx-auto cursor-none"
            style={{ width: canvasWidth, height: canvasHeight }}
            onMouseMove={handleMouseMove}
          >
            {/* Bricks */}
            {bricks.map((brick, index) => (
              !brick.destroyed && (
                <div
                  key={index}
                  className="absolute bg-gradient-to-r from-primary to-secondary rounded-sm"
                  style={{
                    left: brick.x,
                    top: brick.y,
                    width: brick.width,
                    height: brick.height
                  }}
                />
              )
            ))}
            
            {/* Ball */}
            <div
              className="absolute bg-accent rounded-full"
              style={{
                left: ball.x - ballRadius,
                top: ball.y - ballRadius,
                width: ballRadius * 2,
                height: ballRadius * 2
              }}
            />
            
            {/* Paddle */}
            <div
              className="absolute bg-foreground rounded-t-lg"
              style={{
                left: paddleX,
                top: canvasHeight - 20,
                width: paddleWidth,
                height: paddleHeight
              }}
            />
            
            {gameState === 'paused' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">PAUSED</div>
              </div>
            )}
            
            {gameState === 'gameOver' && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                <div className="text-2xl font-bold mb-2">Game Over!</div>
                <div className="text-lg mb-4">Final Score: {score}</div>
                <Button onClick={startGame} className="btn-gaming">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};