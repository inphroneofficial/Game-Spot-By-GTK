import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface QuickMathProps {
  onBack: () => void;
}

export const QuickMath = ({ onBack }: QuickMathProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: "+", correctAnswer: 0 });
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameActive, timeLeft]);

  const generateQuestion = () => {
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;
    let correctAnswer = 0;

    switch (operator) {
      case "+":
        correctAnswer = num1 + num2;
        break;
      case "-":
        if (num1 < num2) [num1, num2] = [num2, num1];
        correctAnswer = num1 - num2;
        break;
      case "×":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        correctAnswer = num1 * num2;
        break;
    }

    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrong = correctAnswer + offset;
      if (wrong !== correctAnswer && wrong >= 0 && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setQuestion({ num1, num2, operator, correctAnswer });
    setOptions(allOptions);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    generateQuestion();
  };

  const endGame = () => {
    setGameActive(false);
    const bestScore = parseInt(localStorage.getItem("quick-math-best") || "0");
    if (score > bestScore) {
      localStorage.setItem("quick-math-best", score.toString());
      toast.success("🎉 New high score!");
    }
  };

  const handleAnswer = (answer: number) => {
    if (!gameActive) return;

    if (answer === question.correctAnswer) {
      setScore(prev => prev + 1);
      toast.success("+1 Point!");
      generateQuestion();
    } else {
      toast.error("Wrong answer!");
      generateQuestion();
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
          <h1 className="text-2xl sm:text-3xl font-bold">Quick Math</h1>
          <Button variant="outline" onClick={startGame} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="card-gaming p-6 sm:p-8 text-center mb-8">
          <div className="text-4xl sm:text-6xl mb-4">🧮</div>
          <div className="text-xl sm:text-2xl mb-2">
            Score: <span className="text-primary font-bold">{score}</span>
          </div>
          <div className="text-lg sm:text-xl mb-4">
            Time: <span className="text-accent font-bold">{timeLeft}s</span>
          </div>
          {!gameActive && (
            <Button className="btn-gaming text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6" onClick={startGame}>
              Start Game
            </Button>
          )}
        </div>

        {gameActive && (
          <>
            <div className="card-gaming p-8 sm:p-12 text-center mb-8">
              <div className="text-5xl sm:text-7xl font-bold mb-8 sm:mb-12">
                {question.num1} {question.operator} {question.num2} = ?
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                {options.map((option) => (
                  <Button
                    key={option}
                    className="btn-gaming text-2xl sm:text-4xl py-8 sm:py-12 font-bold"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="card-gaming p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">How to Play</h3>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>• Solve math problems as quickly as possible</li>
            <li>• Choose the correct answer from 4 options</li>
            <li>• Score points for each correct answer</li>
            <li>• You have 60 seconds!</li>
            <li>• Perfect for improving mental math skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
