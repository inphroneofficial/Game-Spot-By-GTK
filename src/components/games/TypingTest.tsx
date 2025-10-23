import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

interface TypingTestProps {
  onBack: () => void;
}

export const TypingTest = ({ onBack }: TypingTestProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalChars, setTotalChars] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog near the riverbank where children often play during sunny afternoons.",
    "Programming is the art of telling another human being what one wants the computer to do with precision and clarity.",
    "Science and technology revolutionize our lives but memory tradition and myth frame our response to change and progress.",
    "In the depths of winter I finally learned that within me there lay an invincible summer of hope and determination.",
    "The best way to predict the future is to create it through careful planning dedication and consistent daily action.",
    "Success is not final failure is not fatal it is the courage to continue that counts in the journey of life.",
    "Education is the most powerful weapon which you can use to change the world and make it a better place for everyone.",
    "Innovation distinguishes between a leader and a follower in the rapidly evolving landscape of modern business.",
    "The only way to do great work is to love what you do and pursue your passions with unwavering commitment.",
    "Life is what happens to you while you are busy making other plans so remember to enjoy the present moment."
  ];

  const getRandomText = () => {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  };

  const startTest = () => {
    setCurrentText(getRandomText());
    setUserInput('');
    setTimeLeft(60);
    setTotalChars(0);
    setCorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(new Date());
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const calculateStats = (input: string, target: string) => {
    let correct = 0;
    let total = input.length;

    for (let i = 0; i < input.length; i++) {
      if (i < target.length && input[i] === target[i]) {
        correct++;
      }
    }

    const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 100;
    
    // Calculate WPM based on correct characters (5 chars = 1 word)
    const timeElapsed = startTime ? (new Date().getTime() - startTime.getTime()) / 1000 / 60 : 0;
    const wordsTyped = correct / 5;
    const calculatedWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

    return { correct, total, accuracyPercent, calculatedWpm };
  };

  const handleInputChange = (value: string) => {
    setUserInput(value);
    
    const stats = calculateStats(value, currentText);
    setCorrectChars(stats.correct);
    setTotalChars(stats.total);
    setAccuracy(stats.accuracyPercent);
    setWpm(stats.calculatedWpm);

    // Auto-complete when text is finished
    if (value.length >= currentText.length) {
      finishTest();
    }
  };

  const finishTest = () => {
    setGameState('finished');
    saveResult({ wpm, accuracy, correctChars, totalChars });
  };

  const saveResult = (result: { wpm: number; accuracy: number; correctChars: number; totalChars: number }) => {
    const saved = localStorage.getItem('typing-test-records');
    const records = saved ? JSON.parse(saved) : [];
    records.push({ ...result, date: new Date().toISOString() });
    records.sort((a: any, b: any) => b.wpm - a.wpm);
    localStorage.setItem('typing-test-records', JSON.stringify(records.slice(0, 10)));
  };

  const getBestRecords = () => {
    const saved = localStorage.getItem('typing-test-records');
    return saved ? JSON.parse(saved) : [];
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return 'text-muted-foreground';
    if (userInput[index] === currentText[index]) return 'text-accent bg-accent/20';
    return 'text-destructive bg-destructive/20';
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishTest();
    }
  }, [gameState, timeLeft]);

  if (gameState === 'menu') {
    const bestRecords = getBestRecords();

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">⌨️</div>
            <CardTitle className="text-4xl font-bold mb-2">Typing Speed Test</CardTitle>
            <p className="text-muted-foreground">Test your typing speed and accuracy!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>Best Records:</strong></p>
              <div className="text-sm space-y-1">
                {bestRecords.slice(0, 3).map((record: any, index: number) => (
                  <div key={index}>
                    #{index + 1}: {record.wpm} WPM ({record.accuracy}% accuracy)
                  </div>
                ))}
                {bestRecords.length === 0 && <div>No records yet!</div>}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Type the displayed text as accurately as possible</p>
              <p>• Test duration: 60 seconds</p>
              <p>• Focus on accuracy first, speed will follow</p>
              <p>• WPM = Words Per Minute (5 characters = 1 word)</p>
            </div>
            <Button onClick={startTest} className="btn-gaming">
              <Play className="w-4 h-4 mr-2" />
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="card-gaming w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-6 text-lg">
            <span className={timeLeft <= 10 ? 'text-destructive animate-pulse font-bold' : 'font-bold'}>
              Time: {timeLeft}s
            </span>
            <span>WPM: <span className="font-bold text-primary">{wpm}</span></span>
            <span>Accuracy: <span className="font-bold text-accent">{accuracy}%</span></span>
          </div>
          <Button variant="outline" onClick={startTest}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Text Display */}
            <div className="bg-muted p-6 rounded-lg text-lg leading-relaxed font-mono border-2 border-primary/20">
              {currentText.split('').map((char, index) => (
                <span key={index} className={getCharacterClass(index)}>
                  {char}
                </span>
              ))}
            </div>

            {/* Input Area */}
            {gameState === 'playing' && (
              <div>
                <Input
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Start typing here..."
                  className="text-lg font-mono p-4 h-14"
                  autoComplete="off"
                  spellCheck={false}
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Progress: {userInput.length}/{currentText.length} characters
                </p>
              </div>
            )}

            {/* Results */}
            {gameState === 'finished' && (
              <div className="text-center space-y-6">
                <div className="text-3xl font-bold text-accent">Test Complete!</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{wpm}</div>
                    <div className="text-sm">WPM</div>
                  </div>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{accuracy}%</div>
                    <div className="text-sm">Accuracy</div>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{correctChars}</div>
                    <div className="text-sm">Correct Chars</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">{totalChars}</div>
                    <div className="text-sm">Total Chars</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {getBestRecords()[0] && wpm >= getBestRecords()[0].wpm ? "🏆 New Personal Best!" : ""}
                </div>

                <Button onClick={startTest} className="btn-gaming">
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