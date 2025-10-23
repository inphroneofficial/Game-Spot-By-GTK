import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FlappyBirdProps {
  onBack: () => void;
}

type GameState = 'menu' | 'playing' | 'gameOver';

interface Bird {
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  gapY: number;
  gapHeight: number;
  passed: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_SPEED = 3;

export function FlappyBird({ onBack }: FlappyBirdProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [bird, setBird] = useState<Bird>({ y: CANVAS_HEIGHT / 2, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('flappy-bird-best');
    return saved ? parseInt(saved) : 0;
  });

  const resetGame = useCallback(() => {
    setBird({ y: CANVAS_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
    }
  }, [gameState]);

  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const generatePipe = (x: number): Pipe => {
    const gapY = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x,
      gapY,
      gapHeight: PIPE_GAP,
      passed: false
    };
  };

  const checkCollision = (bird: Bird, pipes: Pipe[]): boolean => {
    // Check ground collision
    if (bird.y + BIRD_SIZE >= CANVAS_HEIGHT || bird.y <= 0) {
      return true;
    }

    // Check pipe collision
    for (const pipe of pipes) {
      const birdLeft = CANVAS_WIDTH / 4 - BIRD_SIZE / 2;
      const birdRight = CANVAS_WIDTH / 4 + BIRD_SIZE / 2;
      const birdTop = bird.y - BIRD_SIZE / 2;
      const birdBottom = bird.y + BIRD_SIZE / 2;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Bird is horizontally aligned with pipe
        if (birdTop < pipe.gapY || birdBottom > pipe.gapY + pipe.gapHeight) {
          return true;
        }
      }
    }

    return false;
  };

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    setBird(prev => {
      const newBird = {
        y: prev.y + prev.velocity,
        velocity: prev.velocity + GRAVITY
      };

      return newBird;
    });

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      
      // Remove pipes that are off screen
      newPipes = newPipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
      
      // Add new pipe when needed
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200) {
        newPipes.push(generatePipe(CANVAS_WIDTH));
      }

      // Check for scoring
      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < CANVAS_WIDTH / 4) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      return newPipes;
    });
  }, [gameState]);

  const gameOver = useCallback(() => {
    setGameState('gameOver');
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('flappy-bird-best', score.toString());
      toast({
        title: "New Best Score!",
        description: `You scored ${score} points!`
      });
    }
  }, [score, bestScore, toast]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      updateGame();
      
      // Check collision after state update
      setTimeout(() => {
        setBird(currentBird => {
          setPipes(currentPipes => {
            if (checkCollision(currentBird, currentPipes)) {
              gameOver();
            }
            return currentPipes;
          });
          return currentBird;
        });
      }, 0);
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [gameState, updateGame, gameOver]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gameState === 'playing' || gameState === 'gameOver') {
      // Draw pipes
      ctx.fillStyle = '#228B22';
      pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, PIPE_WIDTH, CANVAS_HEIGHT - pipe.gapY - pipe.gapHeight);
        
        // Pipe caps
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(pipe.x - 5, pipe.gapY - 30, PIPE_WIDTH + 10, 30);
        ctx.fillRect(pipe.x - 5, pipe.gapY + pipe.gapHeight, PIPE_WIDTH + 10, 30);
        ctx.fillStyle = '#228B22';
      });

      // Draw bird
      const birdX = CANVAS_WIDTH / 4;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(birdX, bird.y, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(birdX + 5, bird.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.moveTo(birdX + BIRD_SIZE / 2, bird.y);
      ctx.lineTo(birdX + BIRD_SIZE / 2 + 8, bird.y - 2);
      ctx.lineTo(birdX + BIRD_SIZE / 2 + 8, bird.y + 2);
      ctx.closePath();
      ctx.fill();
    }

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    
    // Ground pattern
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.fillRect(i, CANVAS_HEIGHT - 50, 10, 10);
    }
  }, [bird, pipes, gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (gameState === 'menu') {
          startGame();
        } else {
          jump();
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        if (gameState === 'gameOver') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, jump]);

  if (gameState === 'menu') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl">🐦 Flying Challenge</CardTitle>
            <div />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Tap to fly and avoid the pipes!
            </p>
            {bestScore > 0 && (
              <div className="flex justify-center">
                <Badge variant="secondary">Best: {bestScore}</Badge>
              </div>
            )}
            <Button onClick={startGame} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Flying
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
        <h2 className="text-2xl font-bold">🐦 Flying Challenge</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Score: {score}</Badge>
          {bestScore > 0 && <Badge variant="outline">Best: {bestScore}</Badge>}
        </div>
      </div>

      <div className="space-y-4">
        {/* Game Canvas */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-2 border-muted rounded cursor-pointer"
                  onClick={jump}
                />
                {gameState === 'playing' && (
                  <div className="absolute top-4 left-4 right-4 text-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {score}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Controls */}
        <div className="md:hidden">
          <Card>
            <CardContent className="p-4">
              <Button 
                onClick={jump} 
                className="w-full h-16 text-xl"
                disabled={gameState !== 'playing'}
              >
                TAP TO FLY
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Controls</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>• <span className="font-semibold">PC:</span> Space bar or Up arrow to fly</p>
            <p>• <span className="font-semibold">Mobile:</span> Tap screen or button to fly</p>
            <p>• Navigate through gaps between pipes</p>
            <p>• Don't hit pipes or the ground!</p>
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
                <p>Score: <span className="font-bold text-2xl">{score}</span></p>
                {score === bestScore && score > 0 && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600">
                    🏆 New Best Score!
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <Button onClick={startGame} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Try Again
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