import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";

interface ColorMatchProps {
  onBack: () => void;
}

const COLORS = [
  { name: "Red", color: "bg-red-500", emoji: "🔴" },
  { name: "Blue", color: "bg-blue-500", emoji: "🔵" },
  { name: "Yellow", color: "bg-yellow-500", emoji: "🟡" },
  { name: "Green", color: "bg-green-500", emoji: "🟢" },
  { name: "Purple", color: "bg-purple-500", emoji: "🟣" },
  { name: "Orange", color: "bg-orange-500", emoji: "🟠" },
];

export const ColorMatch = ({ onBack }: ColorMatchProps) => {
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      generateNewColor();
    }
  }, [gameStarted]);

  const generateNewColor = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setCurrentColor(randomColor);
  };

  const handleColorClick = (selectedColor: typeof COLORS[0]) => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    setTotalAttempts(prev => prev + 1);

    if (selectedColor.name === currentColor.name) {
      setScore(prev => prev + 1);
      toast("🎉 Great job! Correct match!");
      
      // Save progress
      const saved = JSON.parse(localStorage.getItem('color-match-progress') || '{"bestStreak": 0, "totalPlayed": 0}');
      saved.totalPlayed += 1;
      if (score + 1 > saved.bestStreak) {
        saved.bestStreak = score + 1;
      }
      localStorage.setItem('color-match-progress', JSON.stringify(saved));
      
      setTimeout(generateNewColor, 1000);
    } else {
      toast("Try again! Look for the matching color.");
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setGameStarted(false);
  };

  const accuracy = totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

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
            <h1 className="text-3xl font-bold mb-2">Color Match</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score: {score}</span>
              <span>Accuracy: {accuracy}%</span>
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

        {/* Game Area */}
        <div className="card-gaming p-8 mb-8 text-center">
          {!gameStarted ? (
            <div className="space-y-6">
              <div className="text-6xl animate-bounce">🎨</div>
              <h2 className="text-2xl font-bold">Ready to Match Colors?</h2>
              <p className="text-muted-foreground">Click any color below to start!</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Find the color:</h2>
                <div className="text-4xl font-bold animate-bounce-in" style={{ color: currentColor.name.toLowerCase() }}>
                  {currentColor.name}
                </div>
                <div className="text-6xl animate-glow">
                  {currentColor.emoji}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Color Grid */}
        <div className="card-gaming p-6">
          <h3 className="text-lg font-bold mb-6 text-center">Click the matching color:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color)}
                className={`
                  ${color.color} rounded-2xl aspect-square
                  flex flex-col items-center justify-center
                  text-white font-bold text-lg
                  transform transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  active:scale-95
                  ${gameStarted ? 'cursor-pointer' : 'cursor-pointer'}
                `}
              >
                <span className="text-4xl mb-2">{color.emoji}</span>
                <span className="text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        {gameStarted && (
          <div className="text-center mt-8">
            <div className="flex justify-center items-center gap-2 text-accent">
              {[...Array(Math.min(score, 5))].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-current animate-glow" />
              ))}
            </div>
            <p className="text-muted-foreground mt-2">
              {score >= 10 && "Amazing! You're a color matching expert! 🌟"}
              {score >= 5 && score < 10 && "Great job! Keep it up! ⭐"}
              {score < 5 && score > 0 && "Nice work! You're learning fast! 👍"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};