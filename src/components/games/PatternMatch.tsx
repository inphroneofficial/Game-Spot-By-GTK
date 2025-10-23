import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface PatternMatchProps {
  onBack: () => void;
}

const PATTERNS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];

export const PatternMatch = ({ onBack }: PatternMatchProps) => {
  const [pattern, setPattern] = useState<string[]>([]);
  const [playerPattern, setPlayerPattern] = useState<string[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [level, setLevel] = useState(1);
  const [showPattern, setShowPattern] = useState(false);

  const startGame = () => {
    setLevel(1);
    setPlayerPattern([]);
    setGameActive(true);
    generatePattern(1);
  };

  const generatePattern = (levelNum: number) => {
    const length = Math.min(levelNum + 2, 10);
    const newPattern = Array.from(
      { length }, 
      () => PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
    );
    setPattern(newPattern);
    setPlayerPattern([]);
    setShowPattern(true);
    
    setTimeout(() => setShowPattern(false), 2000 + levelNum * 500);
  };

  const handlePatternClick = (emoji: string) => {
    if (!gameActive || showPattern) return;

    const newPlayerPattern = [...playerPattern, emoji];
    setPlayerPattern(newPlayerPattern);

    const currentIndex = newPlayerPattern.length - 1;

    if (newPlayerPattern[currentIndex] !== pattern[currentIndex]) {
      toast.error("Wrong pattern! Game Over!");
      setGameActive(false);
      
      const bestLevel = parseInt(localStorage.getItem("pattern-match-best") || "0");
      if (level > bestLevel) {
        localStorage.setItem("pattern-match-best", level.toString());
        toast.success("🎉 New record!");
      }
      return;
    }

    if (newPlayerPattern.length === pattern.length) {
      toast.success("Perfect! Next level!");
      setLevel(prev => prev + 1);
      setTimeout(() => generatePattern(level + 1), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Pattern Match</h1>
          <Button variant="outline" onClick={startGame} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="card-gaming p-6 sm:p-8 text-center mb-8">
          <div className="text-4xl sm:text-6xl mb-4">🎨</div>
          <div className="text-xl sm:text-2xl mb-4">
            Level: <span className="text-primary font-bold">{level}</span>
          </div>
          <div className="text-base sm:text-lg text-muted-foreground mb-4">
            {showPattern && "Memorize this pattern!"}
            {!showPattern && gameActive && "Recreate the pattern"}
            {!gameActive && "Ready to test your memory?"}
          </div>
          {!gameActive && (
            <Button className="btn-gaming text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6" onClick={startGame}>
              Start Game
            </Button>
          )}
        </div>

        <div className="card-gaming p-6 sm:p-8 mb-8">
          <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {showPattern && pattern.map((emoji, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl md:text-6xl animate-scale-in">
                {emoji}
              </span>
            ))}
            {!showPattern && gameActive && playerPattern.map((emoji, idx) => (
              <span key={idx} className="text-4xl sm:text-5xl md:text-6xl">
                {emoji}
              </span>
            ))}
          </div>

          {!showPattern && gameActive && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 max-w-2xl mx-auto">
              {PATTERNS.map((emoji) => (
                <Button
                  key={emoji}
                  onClick={() => handlePatternClick(emoji)}
                  className="btn-gaming text-4xl sm:text-5xl py-6 sm:py-8 aspect-square"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="card-gaming p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">How to Play</h3>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>• Memorize the pattern of colored circles</li>
            <li>• Recreate the pattern by tapping the circles</li>
            <li>• Each level adds more circles to remember</li>
            <li>• One mistake ends the game</li>
            <li>• Great for improving visual memory!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
