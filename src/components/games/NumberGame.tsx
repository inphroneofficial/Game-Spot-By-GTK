"use client";

import { useState, useEffect, useCallback } from "react";
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

  // ✅ Wrap generateLevel in useCallback to prevent re-renders
  const generateLevel = useCallback(() => {
    const maxNumber = Math.min(level + 2, 10);
    const target = Math.floor(Math.random() * maxNumber) + 1;

    const numbersArray: number[] = [target];
    const arraySize = Math.min(level + 3, 8);

    while (numbersArray.length < arraySize) {
      const randomNum = Math.floor(Math.random() * maxNumber) + 1;
      if (!numbersArray.includes(randomNum)) numbersArray.push(randomNum);
    }

    // Shuffle
    for (let i = numbersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbersArray[i], numbersArray[j]] = [numbersArray[j], numbersArray[i]];
    }

    setTargetNumber(target);
    setNumbers(numbersArray);
  }, [level]);

  // ✅ Initialize game safely (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(
          localStorage.getItem("number-game-progress") ||
            '{"highestLevel":1,"bestScore":0}'
        );
        if (saved.highestLevel) setLevel(saved.highestLevel);
      } catch {
        // ignore corrupt data
      }
    }
    generateLevel();
  }, [generateLevel]);

  const handleNumberClick = (clickedNumber: number) => {
    if (!gameStarted) setGameStarted(true);

    if (clickedNumber === targetNumber) {
      const newScore = score + 1;
      setScore(newScore);
      toast.success(`🎉 Correct! You found ${targetNumber}!`);

      if (newScore % 3 === 0) {
        setLevel(prev => prev + 1);
        toast(`🌟 Level up! Level ${level + 1}`);
      }

      if (typeof window !== "undefined") {
        try {
          const saved = JSON.parse(
            localStorage.getItem("number-game-progress") ||
              '{"highestLevel":1,"bestScore":0}'
          );
          if (newScore > saved.bestScore) saved.bestScore = newScore;
          if (level > saved.highestLevel) saved.highestLevel = level;
          localStorage.setItem("number-game-progress", JSON.stringify(saved));
        } catch (err) {
          console.error("Error saving progress:", err);
        }
      }

      setTimeout(() => generateLevel(), 1000);
    } else {
      toast(`❌ Try again! Look for ${targetNumber}`);
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
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
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
            Back
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
        <Card className="p-8 mb-8 text-center">
          <CardContent className="space-y-6">
            {!gameStarted ? (
              <>
                <div className="text-6xl animate-bounce">🔢</div>
                <h2 className="text-2xl font-bold">Ready to Hunt Numbers?</h2>
                <p className="text-muted-foreground">
                  Click any number below to start!
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                  <h2 className="text-3xl font-bold">Find the number:</h2>
                  <Sparkles className="h-8 w-8 text-accent animate-pulse" />
                </div>
                <div className="text-8xl font-bold text-primary animate-bounce">
                  {targetNumber}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Numbers Grid */}
        <Card className="p-6">
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="p-6 text-center mt-6">
          <CardContent>
            <h3 className="text-lg font-bold mb-4">Level {level}</h3>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    i < score % 3 ? "bg-accent" : "bg-muted/30"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {3 - (score % 3)} more correct answer
              {3 - (score % 3) === 1 ? "" : "s"} to next level!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
