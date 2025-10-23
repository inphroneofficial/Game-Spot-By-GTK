import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeedClickerProps {
  onBack: () => void;
}

export function SpeedClicker({ onBack }: SpeedClickerProps) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [cps, setCps] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setGameOver(true);
            const finalCps = clicks / 10;
            setCps(finalCps);
            
            let message = "Good effort! ";
            if (finalCps > 8) message = "Lightning fast! ⚡";
            else if (finalCps > 6) message = "Excellent speed! 🔥";
            else if (finalCps > 4) message = "Great clicking! 👍";
            
            toast({
              title: "Time's Up!",
              description: `${message} ${finalCps.toFixed(1)} clicks per second`,
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, clicks, toast]);

  const handleClick = () => {
    if (!isActive && !gameOver) {
      setIsActive(true);
    }
    
    if (isActive) {
      setClicks(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setClicks(0);
    setTimeLeft(10);
    setIsActive(false);
    setGameOver(false);
    setCps(0);
  };

  const getClickerSize = () => {
    if (clicks > 100) return 'h-32 w-32';
    if (clicks > 50) return 'h-28 w-28';
    if (clicks > 20) return 'h-24 w-24';
    return 'h-20 w-20';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Speed Clicker</h1>
            <p className="text-muted-foreground text-sm">Click as fast as you can!</p>
          </div>
        </div>

        <Card className="card-gaming">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Click Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-primary">{clicks}</div>
                <div className="text-sm text-muted-foreground">Clicks</div>
              </div>
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-accent">{timeLeft}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-secondary">
                  {gameOver ? cps.toFixed(1) : (timeLeft < 10 && isActive ? (clicks / (10 - timeLeft)).toFixed(1) : '0.0')}
                </div>
                <div className="text-sm text-muted-foreground">CPS</div>
              </div>
            </div>

            {/* Click Button */}
            <div className="flex justify-center py-8">
              <Button
                onClick={handleClick}
                disabled={gameOver}
                className={`${getClickerSize()} rounded-full text-2xl font-bold transition-all duration-200 hover:scale-110 active:scale-95`}
                style={{
                  background: `radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)`,
                  animation: isActive ? 'glow 0.5s ease-in-out infinite alternate' : 'none'
                }}
              >
                {!isActive && !gameOver ? (
                  <div className="flex flex-col items-center gap-1">
                    <Play className="w-8 h-8" />
                    <span className="text-sm">START</span>
                  </div>
                ) : (
                  <span className="text-3xl">{clicks}</span>
                )}
              </Button>
            </div>

            {/* Game Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={resetGame}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {/* Instructions */}
            <Card className="card-gaming p-4">
              <h3 className="font-bold mb-2 text-center text-primary">How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click the big button to start the 10-second timer</li>
                <li>• Click as fast as you can within the time limit</li>
                <li>• Try to achieve the highest clicks per second (CPS)</li>
                <li>• The button grows bigger as you click more!</li>
              </ul>
              <div className="mt-4 text-center">
                <div className="text-xs text-muted-foreground mb-2">Target Scores:</div>
                <div className="flex justify-around text-xs">
                  <span className="text-yellow-500">4+ CPS: Good</span>
                  <span className="text-orange-500">6+ CPS: Great</span>
                  <span className="text-red-500">8+ CPS: Amazing</span>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}