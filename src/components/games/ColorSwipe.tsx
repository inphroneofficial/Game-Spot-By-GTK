import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ColorSwipeProps {
  onBack: () => void;
}

const COLORS = [
  { name: "RED", color: "bg-red-500", value: "red" },
  { name: "BLUE", color: "bg-blue-500", value: "blue" },
  { name: "GREEN", color: "bg-green-500", value: "green" },
  { name: "YELLOW", color: "bg-yellow-500", value: "yellow" },
  { name: "PURPLE", color: "bg-purple-500", value: "purple" },
  { name: "ORANGE", color: "bg-orange-500", value: "orange" },
];

export const ColorSwipe = ({ onBack }: ColorSwipeProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [targetDirection, setTargetDirection] = useState<"left" | "right">("right");
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    generateChallenge();
  };

  const generateChallenge = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomDirection = Math.random() > 0.5 ? "right" : "left";
    setCurrentColor(randomColor);
    setTargetDirection(randomDirection);
  };

  const endGame = () => {
    setGameActive(false);
    const bestScore = parseInt(localStorage.getItem("color-swipe-best") || "0");
    if (score > bestScore) {
      localStorage.setItem("color-swipe-best", score.toString());
      toast.success("🎉 New high score!");
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (!gameActive) return;

    if (direction === targetDirection) {
      setScore(prev => prev + 1);
      toast.success("+1 Point!");
      generateChallenge();
    } else {
      toast.error("Wrong direction!");
      setScore(prev => Math.max(0, prev - 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      handleSwipe(diff > 0 ? "left" : "right");
    }
    setTouchStart(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Color Swipe</h1>
          <Button variant="outline" onClick={startGame} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="card-gaming p-8 text-center mb-8">
          <div className="text-6xl mb-4">⬅️➡️</div>
          <div className="text-2xl mb-4">
            Score: <span className="text-primary font-bold">{score}</span>
          </div>
          <div className="text-xl mb-4">
            Time: <span className="text-accent font-bold">{timeLeft}s</span>
          </div>
          {!gameActive && (
            <Button className="btn-gaming text-lg px-8 py-6" onClick={startGame}>
              Start Game
            </Button>
          )}
        </div>

        {gameActive && (
          <div 
            className="card-gaming p-12 text-center touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <p className="text-2xl mb-6 text-muted-foreground">
              Swipe <span className="text-primary font-bold">{targetDirection.toUpperCase()}</span> for:
            </p>
            <div className={`w-48 h-48 mx-auto rounded-3xl ${currentColor.color} shadow-2xl mb-6 animate-scale-in`} />
            <p className="text-4xl font-bold mb-8">{currentColor.name}</p>
            
            {/* Desktop buttons */}
            <div className="hidden sm:flex gap-4 justify-center">
              <Button 
                className="btn-gaming text-xl px-12 py-8" 
                onClick={() => handleSwipe("left")}
              >
                ⬅️ Swipe Left
              </Button>
              <Button 
                className="btn-gaming text-xl px-12 py-8" 
                onClick={() => handleSwipe("right")}
              >
                Swipe Right ➡️
              </Button>
            </div>
            
            {/* Mobile instruction */}
            <p className="sm:hidden text-muted-foreground mt-4">
              👆 Swipe on this card to play
            </p>
          </div>
        )}

        <div className="card-gaming p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">How to Play</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Swipe in the correct direction for each color</li>
            <li>• Mobile: Swipe left or right on the card</li>
            <li>• Desktop: Click the direction buttons</li>
            <li>• Score points for correct swipes</li>
            <li>• You have 30 seconds!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
