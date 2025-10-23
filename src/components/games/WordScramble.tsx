import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RefreshCw, Lightbulb, ArrowLeft } from 'lucide-react';

interface WordScrambleProps {
  onBack?: () => void;
}

const WORDS = [
  { word: 'JAVASCRIPT', hint: 'Popular programming language' },
  { word: 'COMPUTER', hint: 'Electronic device' },
  { word: 'KEYBOARD', hint: 'Input device' },
  { word: 'INTERNET', hint: 'Global network' },
  { word: 'BUTTERFLY', hint: 'Flying insect' },
  { word: 'MOUNTAIN', hint: 'Tall landform' },
  { word: 'CHOCOLATE', hint: 'Sweet treat' },
  { word: 'RAINBOW', hint: 'Colorful arc in sky' },
  { word: 'ELEPHANT', hint: 'Large animal' },
  { word: 'FOOTBALL', hint: 'Popular sport' },
  { word: 'SUNSHINE', hint: 'Bright daylight' },
  { word: 'WATERFALL', hint: 'Cascading water' },
];

export default function WordScramble({ onBack }: WordScrambleProps) {
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const scrambleWord = (word: string) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const loadNewWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(newWord);
    setScrambled(scrambleWord(newWord.word));
    setUserInput('');
    setShowHint(false);
    setAttempts(0);
  };

  useEffect(() => {
    loadNewWord();
  }, []);

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    
    if (userInput.toUpperCase() === currentWord.word) {
      const points = showHint ? 5 : 10;
      setScore(prev => prev + points);
      toast.success(`Correct! +${points} points`);
      setTimeout(loadNewWord, 1000);
    } else {
      toast.error('Try again!');
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    toast.info(currentWord.hint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          )}
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Word Scramble
            </h2>
            <p className="text-muted-foreground">Unscramble the letters!</p>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground mb-2">Score</div>
            <div className="text-4xl font-bold text-primary">{score}</div>
          </div>

          <div className="text-center space-y-4">
            <div className="text-5xl font-bold tracking-widest text-primary">
              {scrambled}
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowHint}
                disabled={showHint}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint (-5 pts)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadNewWord}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Skip
              </Button>
            </div>

            {showHint && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 {currentWord.hint}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your answer..."
              className="text-center text-xl uppercase"
              autoComplete="off"
            />
            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
            >
              Submit Answer
            </Button>
          </div>

          {attempts > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Attempts: {attempts}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
