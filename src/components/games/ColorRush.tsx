import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ColorRushProps {
  onBack: () => void;
}

const COLORS = [
  { name: "Red", color: "bg-red-500", hex: "#ef4444" },
  { name: "Blue", color: "bg-blue-500", hex: "#3b82f6" },
  { name: "Green", color: "bg-green-500", hex: "#22c55e" },
  { name: "Yellow", color: "bg-yellow-500", hex: "#eab308" },
  { name: "Purple", color: "bg-purple-500", hex: "#a855f7" },
  { name: "Pink", color: "bg-pink-500", hex: "#ec4899" },
];

export const ColorRush = ({ onBack }: ColorRushProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [displayedWord, setDisplayedWord] = useState(COLORS[0].name);
  const [wordColor, setWordColor] = useState(COLORS[0].hex);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("color-rush-high-score");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const generateChallenge = useCallback(() => {
    const wordIndex = Math.floor(Math.random() * COLORS.length);
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    
    setCurrentColor(COLORS[wordIndex]);
    setDisplayedWord(COLORS[wordIndex].name);
    setWordColor(COLORS[colorIndex].hex);
  }, []);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("color-rush-high-score", score.toString());
        toast("🎉 New high score!");
      } else {
        toast("⏰ Time's up!");
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, score, highScore]);

  const handleAnswer = (isCorrect: boolean) => {
    if (!isPlaying) return;

    const wordColorMatches = currentColor.hex === wordColor;
    
    if ((isCorrect && wordColorMatches) || (!isCorrect && !wordColorMatches)) {
      setScore(prev => prev + 10);
      toast("✅ Correct! +10 points");
    } else {
      setScore(prev => Math.max(0, prev - 5));
      toast("❌ Wrong! -5 points");
    }
    
    generateChallenge();
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    generateChallenge();
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    generateChallenge();
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
            <h1 className="text-3xl font-bold mb-2">Color Rush</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score: {score}</span>
              <span>High Score: {highScore}</span>
              <span>Time: {timeLeft}s</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isPlaying && !gameOver && (
              <Button
                className="flex items-center gap-2 btn-gaming"
                onClick={startGame}
              >
                <Play className="h-4 w-4" />
                Start Game
              </Button>
            )}
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

        {/* Instructions */}
        <div className="card-gaming p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">How to Play</h2>
          <p className="text-center text-muted-foreground">
            Look at the word and its color. Click "Match" if the word matches its color, 
            or "No Match" if they don't match. Be fast and accurate!
          </p>
        </div>

        {/* Game Area */}
        <div className="card-gaming p-8 mb-8">
          <div className="text-center">
            <div className="mb-8">
              <h2 
                className="text-8xl font-bold animate-bounce-in"
                style={{ color: wordColor }}
              >
                {displayedWord}
              </h2>
            </div>
            
            {isPlaying && (
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleAnswer(true)}
                  className="btn-gaming px-12 py-6 text-xl"
                  size="lg"
                >
                  ✅ Match
                </Button>
                <Button
                  onClick={() => handleAnswer(false)}
                  className="btn-gaming px-12 py-6 text-xl"
                  size="lg"
                  variant="destructive"
                >
                  ❌ No Match
                </Button>
              </div>
            )}
            
            {!isPlaying && !gameOver && (
              <div className="text-muted-foreground">
                Click "Start Game" to begin!
              </div>
            )}
          </div>
        </div>

        {/* Color Reference */}
        <div className="card-gaming p-6">
          <h3 className="text-lg font-bold mb-4 text-center">Color Reference</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {COLORS.map((color) => (
              <div key={color.name} className="text-center">
                <div 
                  className={`w-16 h-16 rounded-lg mx-auto mb-2 ${color.color}`}
                />
                <span className="text-sm text-muted-foreground">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {gameOver && (
          <div className="text-center mt-8 animate-bounce-in">
            <h2 className="text-2xl font-bold text-primary mb-4">
              🎮 Game Over!
            </h2>
            <p className="text-muted-foreground mb-4">
              Final Score: {score}
              {score === highScore && score > 0 && (
                <span className="text-accent ml-2">🎉 New High Score!</span>
              )}
            </p>
            <Button
              className="btn-gaming"
              onClick={startGame}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};