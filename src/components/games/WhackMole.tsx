import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';

interface WhackMoleProps {
  onBack: () => void;
}

interface Mole {
  id: number;
  isVisible: boolean;
  timeLeft: number;
}

export const WhackMole = ({ onBack }: WhackMoleProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moles, setMoles] = useState<Mole[]>([]);

  const TOTAL_HOLES = 9;
  const GAME_DURATION = 30;

  const initializeMoles = () => {
    return Array.from({ length: TOTAL_HOLES }, (_, i) => ({
      id: i,
      isVisible: false,
      timeLeft: 0
    }));
  };

  const startGame = () => {
    setMoles(initializeMoles());
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  };

  const whackMole = (moleId: number) => {
    if (gameState !== 'playing') return;

    setMoles(prev => {
      const newMoles = [...prev];
      if (newMoles[moleId].isVisible) {
        newMoles[moleId].isVisible = false;
        newMoles[moleId].timeLeft = 0;
        setScore(prevScore => prevScore + 100);
      } else {
        // Penalty for missing
        setScore(prevScore => Math.max(0, prevScore - 25));
      }
      return newMoles;
    });
  };

  const saveHighScore = (finalScore: number) => {
    const saved = localStorage.getItem('whack-mole-scores');
    const scores = saved ? JSON.parse(saved) : [];
    scores.push(finalScore);
    scores.sort((a: number, b: number) => b - a);
    localStorage.setItem('whack-mole-scores', JSON.stringify(scores.slice(0, 5)));
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameOver');
      saveHighScore(score);
    }
  }, [gameState, timeLeft, score]);

  // Mole spawning logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnMole = () => {
      if (Math.random() < 0.6) { // 60% chance to spawn a mole
        const availableHoles = moles
          .map((mole, index) => ({ mole, index }))
          .filter(({ mole }) => !mole.isVisible);

        if (availableHoles.length > 0) {
          const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
          const moleVisibleTime = Math.random() * 1500 + 1000; // 1-2.5 seconds

          setMoles(prev => {
            const newMoles = [...prev];
            newMoles[randomHole.index] = {
              ...newMoles[randomHole.index],
              isVisible: true,
              timeLeft: moleVisibleTime
            };
            return newMoles;
          });
        }
      }
    };

    const interval = setInterval(spawnMole, 800);
    return () => clearInterval(interval);
  }, [gameState, moles]);

  // Mole visibility timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setMoles(prev => prev.map(mole => {
        if (mole.isVisible && mole.timeLeft > 0) {
          const newTimeLeft = mole.timeLeft - 50;
          if (newTimeLeft <= 0) {
            return { ...mole, isVisible: false, timeLeft: 0 };
          }
          return { ...mole, timeLeft: newTimeLeft };
        }
        return mole;
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  const getHighScores = () => {
    const saved = localStorage.getItem('whack-mole-scores');
    return saved ? JSON.parse(saved) : [];
  };

  if (gameState === 'menu') {
    const highScores = getHighScores();

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">🔨</div>
            <CardTitle className="text-4xl font-bold mb-2">Whack-a-Mole</CardTitle>
            <p className="text-muted-foreground">Hit the moles as fast as you can!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>High Scores:</strong></p>
              <div className="text-sm space-y-1">
                {highScores.slice(0, 3).map((score: number, index: number) => (
                  <div key={index}>#{index + 1}: {score} points</div>
                ))}
                {highScores.length === 0 && <div>No scores yet!</div>}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Hit moles when they appear: +100 points</p>
              <p>• Missing or hitting empty holes: -25 points</p>
              <p>• Game lasts 30 seconds</p>
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
          <div className="flex items-center gap-4 text-lg font-bold">
            <span>Score: {score}</span>
            <span className={timeLeft <= 5 ? 'text-destructive animate-pulse' : ''}>
              Time: {timeLeft}s
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-4 mb-6">
              {moles.map((mole) => (
                <div
                  key={mole.id}
                  className="relative w-20 h-20 bg-muted rounded-full border-4 border-muted-foreground overflow-hidden cursor-pointer active:scale-95 transition-transform"
                  onClick={() => whackMole(mole.id)}
                >
                  {/* Hole background */}
                  <div className="absolute inset-2 bg-black rounded-full" />
                  
                  {/* Mole */}
                  {mole.isVisible && (
                    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce-in">
                      🐭
                    </div>
                  )}
                </div>
              ))}
            </div>

            {gameState === 'gameOver' && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold">🎉 Game Over! 🎉</div>
                <div className="text-lg">Final Score: <span className="font-bold text-primary">{score}</span></div>
                <div className="text-sm text-muted-foreground">
                  {getHighScores()[0] && score >= getHighScores()[0] ? "🏆 New High Score!" : ""}
                </div>
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