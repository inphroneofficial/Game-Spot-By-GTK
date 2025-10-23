import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw, Timer, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReactionTimerProps {
  onBack: () => void;
}

export function ReactionTimer({ onBack }: ReactionTimerProps) {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'clicked' | 'tooEarly'>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('reaction-timer-best');
    if (saved) setBestTime(parseInt(saved));
  }, []);

  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('reaction-timer-best', bestTime.toString());
    }
  }, [bestTime]);

  const startGame = () => {
    setGameState('ready');
    setReactionTime(null);
    
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds
    
    timeoutRef.current = setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'ready') {
      clearTimeout(timeoutRef.current);
      setGameState('tooEarly');
      toast({
        title: "Too Early!",
        description: "Wait for the screen to turn green!",
        variant: "destructive"
      });
    } else if (gameState === 'go') {
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      setGameState('clicked');
      setAttempts(prev => prev + 1);
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        toast({
          title: "New Record!",
          description: `Amazing reaction time: ${time}ms!`,
        });
      }
      
      let message = "Good reflexes! ";
      if (time < 200) message = "Lightning fast! ⚡";
      else if (time < 300) message = "Excellent! 🔥";
      else if (time < 400) message = "Great job! 👍";
      
      if (bestTime && time === bestTime) {
        toast({
          title: message.replace('!', ' - New Best!'),
          description: `${time}ms reaction time`,
        });
      }
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    clearTimeout(timeoutRef.current);
    setGameState('waiting');
    setReactionTime(null);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-muted';
      case 'ready': return 'bg-red-500';
      case 'go': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'tooEarly': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  };

  const getStateText = () => {
    switch (gameState) {
      case 'waiting': return 'Click to Start';
      case 'ready': return 'Wait for Green...';
      case 'go': return 'CLICK NOW!';
      case 'clicked': return `${reactionTime}ms`;
      case 'tooEarly': return 'Too Early! Click to retry';
      default: return '';
    }
  };

  const getIcon = () => {
    switch (gameState) {
      case 'waiting': return <Play className="w-12 h-12" />;
      case 'ready': return <Timer className="w-12 h-12 animate-spin" />;
      case 'go': return <Zap className="w-12 h-12 animate-bounce" />;
      case 'clicked': return <span className="text-4xl">🎯</span>;
      case 'tooEarly': return <span className="text-4xl">⚠️</span>;
      default: return null;
    }
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
            <h1 className="text-2xl font-bold text-primary">Reaction Timer</h1>
            <p className="text-muted-foreground text-sm">Test your reflexes!</p>
          </div>
        </div>

        <Card className="card-gaming">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Reaction Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-primary">
                  {reactionTime ? `${reactionTime}ms` : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Last Time</div>
              </div>
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-accent">
                  {bestTime ? `${bestTime}ms` : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Best Time</div>
              </div>
              <div className="card-gaming p-4">
                <div className="text-2xl font-bold text-secondary">{attempts}</div>
                <div className="text-sm text-muted-foreground">Attempts</div>
              </div>
            </div>

            {/* Game Area */}
            <div 
              className={`${getBackgroundColor()} rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 min-h-[300px]`}
              onClick={handleClick}
            >
              <div className="mb-4 text-white">
                {getIcon()}
              </div>
              <div className="text-2xl font-bold text-white text-center">
                {getStateText()}
              </div>
            </div>

            {/* Controls */}
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

            {/* Instructions & Records */}
            <Card className="card-gaming p-4">
              <h3 className="font-bold mb-2 text-center text-primary">How to Play</h3>
              <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                <li>• Click the game area to start</li>
                <li>• Wait for the screen to turn GREEN</li>
                <li>• Click as fast as you can when it turns green</li>
                <li>• Don't click too early or you'll have to restart!</li>
              </ul>
              
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-2">Reaction Time Rankings:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-green-500">Under 200ms: Superhuman</span>
                  <span className="text-blue-500">200-300ms: Excellent</span>
                  <span className="text-yellow-500">300-400ms: Good</span>
                  <span className="text-orange-500">400-500ms: Average</span>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}