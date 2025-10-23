import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, RotateCcw, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface WordGuessProps {
  onBack: () => void;
}

const WORDS = [
  { word: "APPLE", hint: "A red or green fruit" },
  { word: "OCEAN", hint: "Large body of water" },
  { word: "MUSIC", hint: "Sounds in harmony" },
  { word: "FLOWER", hint: "Colorful plant bloom" },
  { word: "CAMERA", hint: "Takes pictures" },
  { word: "PIZZA", hint: "Italian food with toppings" },
  { word: "RAINBOW", hint: "Colorful arc in sky" },
  { word: "BUTTERFLY", hint: "Colorful flying insect" },
  { word: "CHOCOLATE", hint: "Sweet brown treat" },
  { word: "SUNSHINE", hint: "Bright light from sun" },
];

export const WordGuess = ({ onBack }: WordGuessProps) => {
  const [currentWord, setCurrentWord] = useState(WORDS[0]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    newWord();
  }, []);

  const newWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses([]);
    setCurrentGuess("");
    setShowHint(false);
  };

  const displayWord = currentWord.word
    .split("")
    .map(letter => guessedLetters.includes(letter) ? letter : "_")
    .join(" ");

  const isWordComplete = currentWord.word
    .split("")
    .every(letter => guessedLetters.includes(letter));

  const maxWrongGuesses = 6;
  const isGameOver = wrongGuesses.length >= maxWrongGuesses;

  useEffect(() => {
    if (isWordComplete && !isGameOver) {
      const points = Math.max(10 - wrongGuesses.length - hintsUsed, 1);
      setScore(prev => prev + points);
      toast(`🎉 Correct! You earned ${points} points!`);
      
      // Save progress
      const saved = JSON.parse(localStorage.getItem('word-guess-progress') || '{"bestScore": 0, "wordsGuessed": 0}');
      saved.wordsGuessed += 1;
      if (score + points > saved.bestScore) {
        saved.bestScore = score + points;
      }
      localStorage.setItem('word-guess-progress', JSON.stringify(saved));
      
      setTimeout(() => {
        newWord();
      }, 2000);
    }
  }, [isWordComplete, isGameOver, wrongGuesses.length, hintsUsed, score]);

  const handleGuess = () => {
    if (!currentGuess.trim() || currentGuess.length !== 1) return;
    
    const letter = currentGuess.toUpperCase();
    
    if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) {
      toast("You already guessed that letter!");
      setCurrentGuess("");
      return;
    }

    if (currentWord.word.includes(letter)) {
      setGuessedLetters(prev => [...prev, letter]);
      toast("Good guess!");
    } else {
      setWrongGuesses(prev => [...prev, letter]);
      toast("Not in the word. Try again!");
    }
    
    setCurrentGuess("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const resetGame = () => {
    setScore(0);
    setHintsUsed(0);
    newWord();
  };

  const drawHangman = () => {
    const parts = ["😵", "👤", "👕", "👖", "👞", "👞"];
    return (
      <div className="text-6xl">
        {parts.slice(0, wrongGuesses.length).join("")}
      </div>
    );
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
            <h1 className="text-3xl font-bold mb-2">Word Guess</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score: {score}</span>
              <span>Wrong: {wrongGuesses.length}/{maxWrongGuesses}</span>
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
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Word Display */}
          <div className="card-gaming p-8 text-center">
            <h2 className="text-2xl font-bold mb-6">Guess the Word</h2>
            <div className="text-4xl font-mono font-bold mb-6 tracking-widest">
              {displayWord}
            </div>
            
            {showHint && (
              <div className="bg-accent/20 rounded-lg p-4 mb-4">
                <p className="text-accent font-semibold">💡 Hint: {currentWord.hint}</p>
              </div>
            )}
            
            <div className="flex gap-2 mb-4">
              <Input
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.slice(0, 1))}
                onKeyPress={handleKeyPress}
                placeholder="Enter a letter"
                className="text-center text-2xl"
                maxLength={1}
                disabled={isWordComplete || isGameOver}
              />
              <Button
                onClick={handleGuess}
                disabled={!currentGuess.trim() || isWordComplete || isGameOver}
                className="btn-gaming"
              >
                Guess
              </Button>
            </div>
            
            {!showHint && !isWordComplete && !isGameOver && (
              <Button
                variant="outline"
                onClick={useHint}
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Need a Hint? (-1 point)
              </Button>
            )}
          </div>

          {/* Hangman Display */}
          <div className="card-gaming p-8 text-center">
            <h3 className="text-xl font-bold mb-6">Wrong Guesses</h3>
            <div className="mb-6">
              {drawHangman()}
            </div>
            <div className="space-y-2">
              <div className="text-lg">
                <span className="text-muted-foreground">Letters tried: </span>
                <span className="font-mono text-destructive">
                  {wrongGuesses.join(", ") || "None"}
                </span>
              </div>
              <div className="text-lg">
                <span className="text-muted-foreground">Correct letters: </span>
                <span className="font-mono text-accent">
                  {guessedLetters.join(", ") || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        {isGameOver && (
          <div className="card-gaming p-8 text-center animate-bounce-in">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              💀 Game Over!
            </h2>
            <p className="text-muted-foreground mb-4">
              The word was: <span className="text-primary font-bold">{currentWord.word}</span>
            </p>
            <Button className="btn-gaming" onClick={newWord}>
              Try New Word
            </Button>
          </div>
        )}

        {isWordComplete && (
          <div className="card-gaming p-8 text-center animate-bounce-in">
            <h2 className="text-2xl font-bold text-accent mb-4">
              🎉 Well Done!
            </h2>
            <p className="text-muted-foreground mb-4">
              You guessed "{currentWord.word}" correctly!
            </p>
            <Button className="btn-gaming" onClick={newWord}>
              Next Word
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};