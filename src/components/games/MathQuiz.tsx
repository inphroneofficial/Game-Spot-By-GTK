import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, Lightbulb } from 'lucide-react';

interface MathQuizProps {
  onBack: () => void;
}

interface Problem {
  question: string;
  answer: number;
  difficulty: number;
}

export const MathQuiz = ({ onBack }: MathQuizProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = (level: number): Problem => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number, question: string;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * (10 * level)) + 1;
        num2 = Math.floor(Math.random() * (10 * level)) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        num1 = Math.floor(Math.random() * (10 * level)) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '*':
        num1 = Math.floor(Math.random() * (5 + level)) + 2;
        num2 = Math.floor(Math.random() * (5 + level)) + 2;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        num1 = 2;
        num2 = 3;
        answer = 5;
        question = `${num1} + ${num2}`;
    }

    return { question, answer, difficulty: level };
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setTotalProblems(0);
    setCorrectAnswers(0);
    setDifficulty(1);
    setShowResult(null);
    setCurrentProblem(generateProblem(1));
    setUserAnswer('');
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return;

    const isCorrect = parseInt(userAnswer) === currentProblem.answer;
    setTotalProblems(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Base score + streak bonus + difficulty bonus
      const points = 10 + (streak * 2) + (difficulty * 5);
      setScore(prev => prev + points);
      
      // Increase difficulty every 5 correct answers in a row
      if (streak > 0 && streak % 5 === 0) {
        setDifficulty(prev => Math.min(prev + 1, 5));
      }
      
      setShowResult('correct');
    } else {
      setStreak(0);
      setShowResult('wrong');
    }

    // Show result briefly, then next problem
    setTimeout(() => {
      setShowResult(null);
      setCurrentProblem(generateProblem(difficulty));
      setUserAnswer('');
      inputRef.current?.focus();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const finishGame = () => {
    setGameState('finished');
    saveScore(score, correctAnswers, totalProblems);
  };

  const saveScore = (finalScore: number, correct: number, total: number) => {
    const saved = localStorage.getItem('math-quiz-scores');
    const scores = saved ? JSON.parse(saved) : [];
    scores.push({
      score: finalScore,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      correct,
      total,
      date: new Date().toISOString()
    });
    scores.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem('math-quiz-scores', JSON.stringify(scores.slice(0, 10)));
  };

  const getBestScores = () => {
    const saved = localStorage.getItem('math-quiz-scores');
    return saved ? JSON.parse(saved) : [];
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
  }, [gameState, timeLeft]);

  if (gameState === 'menu') {
    const bestScores = getBestScores();

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">🧠</div>
            <CardTitle className="text-4xl font-bold mb-2">Mental Math Quiz</CardTitle>
            <p className="text-muted-foreground">Exercise your brain with quick math!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>High Scores:</strong></p>
              <div className="text-sm space-y-1">
                {bestScores.slice(0, 3).map((record: any, index: number) => (
                  <div key={index}>
                    #{index + 1}: {record.score} points ({record.accuracy}% accuracy)
                  </div>
                ))}
                {bestScores.length === 0 && <div>No scores yet!</div>}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Solve math problems as quickly as possible</p>
              <p>• 60 second time limit</p>
              <p>• Streak bonuses for consecutive correct answers</p>
              <p>• Difficulty increases with your performance</p>
            </div>
            <Button onClick={startGame} className="btn-gaming">
              <Play className="w-4 h-4 mr-2" />
              Start Quiz
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
          <div className="flex items-center gap-4 text-lg">
            <span className={timeLeft <= 10 ? 'text-destructive animate-pulse font-bold' : 'font-bold'}>
              {timeLeft}s
            </span>
            <span>Score: <span className="font-bold text-primary">{score}</span></span>
            <span>Streak: <span className="font-bold text-accent">{streak}</span></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto space-y-6">
            {gameState === 'playing' && currentProblem && (
              <>
                {/* Difficulty Indicator */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Lightbulb className="w-4 h-4" />
                    Level {difficulty}
                  </div>
                </div>

                {/* Problem Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold mb-6 text-primary">
                    {currentProblem.question} = ?
                  </div>
                  
                  {/* Result Feedback */}
                  {showResult && (
                    <div className={`text-2xl font-bold mb-4 ${
                      showResult === 'correct' ? 'text-accent' : 'text-destructive'
                    }`}>
                      {showResult === 'correct' ? '✓ Correct!' : `✗ Wrong! Answer: ${currentProblem.answer}`}
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="space-y-4">
                  <Input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your answer..."
                    className="text-2xl text-center h-16"
                    disabled={showResult !== null}
                  />
                  
                  <Button 
                    onClick={submitAnswer} 
                    className="btn-gaming w-full"
                    disabled={showResult !== null || userAnswer === ''}
                  >
                    Submit Answer
                  </Button>
                </div>

                {/* Progress */}
                <div className="text-center text-sm text-muted-foreground">
                  Problems solved: {correctAnswers}/{totalProblems}
                  {totalProblems > 0 && (
                    <span> • Accuracy: {Math.round((correctAnswers / totalProblems) * 100)}%</span>
                  )}
                </div>
              </>
            )}

            {gameState === 'finished' && (
              <div className="text-center space-y-6">
                <div className="text-3xl font-bold text-accent">🎓 Quiz Complete!</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{score}</div>
                    <div className="text-sm">Final Score</div>
                  </div>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {totalProblems > 0 ? Math.round((correctAnswers / totalProblems) * 100) : 0}%
                    </div>
                    <div className="text-sm">Accuracy</div>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{correctAnswers}</div>
                    <div className="text-sm">Correct</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">{totalProblems}</div>
                    <div className="text-sm">Total</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {getBestScores()[0] && score >= getBestScores()[0].score ? "🏆 New High Score!" : ""}
                </div>

                <Button onClick={startGame} className="btn-gaming">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};