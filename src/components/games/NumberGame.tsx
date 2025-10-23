import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface NumberGameProps {
  onBack: () => void;
}

export const NumberGame = ({ onBack }: NumberGameProps) => {
  const [targetNumber, setTargetNumber] = useState(1);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    generateLevel();
  }, [level]);

  const generateLevel = () => {
    const maxNumber = Math.min(level + 2, 10);
    const target = Math.floor(Math.random() * maxNumber) + 1;
    
    // Generate numbers array with target included
    const numbersArray = [];
    numbersArray.push(target); // Ensure target is always present
    
    // Add random numbers
    const arraySize = Math.min(level + 3, 8);
    while (numbersArray.length < arraySize) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      if (!numbersArray.includes(randomNum)) {
        numbersArray.push(randomNum);
      }
    }
    
    // Shuffle array
    for (let i = numbersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbersArray[i], numbersArray[j]] = [numbersArray[j], numbersArray[i]];
    }
    
    setTargetNumber(target);
    setNumbers(numbersArray);
  };

  const handleNumberClick = (clickedNumber: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (clickedNumber === targetNumber) {
      setScore(prev => prev + 1);
      toast(`🎉 Correct! You found ${targetNumber}!`);
      
      // Level up every 3 correct answers
      if ((score + 1) % 3 === 0) {
        setLevel(prev => prev + 1);
        toast(`🌟 Level up! Level ${level + 1}`);
      }
      
      // Save progress
      const saved = JSON.parse(localStorage.getItem('number-game-progress') || '{"highestLevel": 1, "bestScore": 0}');
      if (score + 1 > saved.bestScore) {
        saved.bestScore = score + 1;
      }
      if (level > saved.highestLevel) {
        saved.highestLevel = level;
      }
      localStorage.setItem('number-game-progress', JSON.stringify(saved));
      
      // Generate new level after short delay
      setTimeout(() => {
        generateLevel();
      }, 1500);
    } else {
      toast(`Try again! Look for ${targetNumber}`);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameStarted(false);
    generateLevel();
  };

  const getNumberColor = (num: number) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
    ];
    return colors[num % colors.length];
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
            <h1 className="text-3xl font-bold mb-2">Number Hunt</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score: {score}</span>
              <span>Level: {level}</span>
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
              <div className="text-6xl animate-bounce">🔢</div>
              <h2 className="text-2xl font-bold">Ready to Hunt Numbers?</h2>
              <p className="text-muted-foreground">Click any number below to start!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-accent animate-glow" />
                <h2 className="text-3xl font-bold">Find the number:</h2>
                <Sparkles className="h-8 w-8 text-accent animate-glow" />
              </div>
              <div className="text-8xl font-bold text-primary animate-bounce-in">
                {targetNumber}
              </div>
            </div>
          )}
        </div>

        {/* Numbers Grid */}
        <div className="card-gaming p-6">
          <h3 className="text-lg font-bold mb-6 text-center">
            Click the number {gameStarted ? targetNumber : "to start"}:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {numbers.map((number, index) => (
              <button
                key={index}
                onClick={() => handleNumberClick(number)}
                className={`
                  ${getNumberColor(number)} rounded-xl aspect-square
                  flex items-center justify-center
                  text-white font-bold text-3xl
                  transform transition-all duration-200
                  hover:scale-110 hover:shadow-lg
                  active:scale-95
                  cursor-pointer
                `}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div className="card-gaming p-6 text-center">
          <h3 className="text-lg font-bold mb-4">Level {level}</h3>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
                  ${i < (score % 3) ? 'bg-accent' : 'bg-muted/30'}
                `}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {3 - (score % 3)} more correct answers to next level!
          </p>
        </div>
      </div>
    </div>
  );
};