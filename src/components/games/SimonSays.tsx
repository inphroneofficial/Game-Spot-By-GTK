import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Volume2 } from 'lucide-react';

interface SimonSaysProps {
  onBack: () => void;
}

type Color = 'red' | 'blue' | 'green' | 'yellow';

export const SimonSays = ({ onBack }: SimonSaysProps) => {
  const [gameState, setGameState] = useState<'menu' | 'showing' | 'input' | 'gameOver'>('menu');
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userInput, setUserInput] = useState<Color[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showingIndex, setShowingIndex] = useState(0);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore] = useState(0);

  const colors: Color[] = ['red', 'blue', 'green', 'yellow'];
  
  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-400 active:bg-red-600',
    blue: 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-400 active:bg-green-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600'
  };

  const generateSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    return [...sequence, newColor];
  };

  const startGame = () => {
    const initialSequence = [colors[Math.floor(Math.random() * colors.length)]];
    setSequence(initialSequence);
    setUserInput([]);
    setCurrentLevel(1);
    setScore(0);
    setGameState('showing');
    setShowingIndex(0);
  };

  const playSound = (color: Color) => {
    // Create a simple beep sound for each color using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = { red: 261.63, blue: 329.63, green: 392.00, yellow: 523.25 };
    oscillator.frequency.setValueAtTime(frequencies[color], audioContext.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showSequence = useCallback(() => {
    if (showingIndex < sequence.length) {
      const currentColor = sequence[showingIndex];
      setActiveColor(currentColor);
      playSound(currentColor);
      
      setTimeout(() => {
        setActiveColor(null);
        setShowingIndex(prev => prev + 1);
      }, 600);
    } else {
      setGameState('input');
      setShowingIndex(0);
    }
  }, [sequence, showingIndex]);

  const handleColorClick = (color: Color) => {
    if (gameState !== 'input') return;

    const newUserInput = [...userInput, color];
    setUserInput(newUserInput);
    playSound(color);

    // Check if the input is correct so far
    if (color !== sequence[newUserInput.length - 1]) {
      setGameState('gameOver');
      saveHighScore(currentLevel);
      return;
    }

    // Check if sequence is complete
    if (newUserInput.length === sequence.length) {
      setScore(prev => prev + currentLevel * 10);
      setCurrentLevel(prev => prev + 1);
      
      // Add new color to sequence and start next round
      setTimeout(() => {
        const nextSequence = generateSequence();
        setSequence(nextSequence);
        setUserInput([]);
        setGameState('showing');
        setShowingIndex(0);
      }, 1000);
    }
  };

  const saveHighScore = (level: number) => {
    const saved = localStorage.getItem('simon-says-progress');
    const scores = saved ? JSON.parse(saved) : [];
    scores.push({ level, score });
    scores.sort((a: any, b: any) => b.level - a.level);
    localStorage.setItem('simon-says-progress', JSON.stringify(scores.slice(0, 5)));
  };

  const getHighScores = () => {
    const saved = localStorage.getItem('simon-says-progress');
    return saved ? JSON.parse(saved) : [];
  };

  // Show sequence effect
  useEffect(() => {
    if (gameState === 'showing') {
      const timer = setTimeout(showSequence, 800);
      return () => clearTimeout(timer);
    }
  }, [gameState, showSequence]);

  if (gameState === 'menu') {
    const highScores = getHighScores();

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">🎵</div>
            <CardTitle className="text-4xl font-bold mb-2">Simon Says</CardTitle>
            <p className="text-muted-foreground">Follow the color sequence!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>Best Levels:</strong></p>
              <div className="text-sm space-y-1">
                {highScores.slice(0, 3).map((record: any, index: number) => (
                  <div key={index}>#{index + 1}: Level {record.level} ({record.score} points)</div>
                ))}
                {highScores.length === 0 && <div>No records yet!</div>}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Watch the sequence of colors</p>
              <p>• Click the colors in the same order</p>
              <p>• Each level adds one more color</p>
              <p>• One mistake ends the game!</p>
            </div>
            <Button onClick={startGame} className="btn-gaming">
              <Play className="w-4 h-4 mr-2" />
              Start Game
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
          <div className="flex items-center gap-4 text-lg font-bold">
            <span>Level: {currentLevel}</span>
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Sound On</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`
                    w-32 h-32 rounded-lg transition-all duration-200 transform
                    ${colorClasses[color]}
                    ${activeColor === color ? 'scale-110 brightness-150' : ''}
                    ${gameState === 'input' ? 'hover:scale-105 active:scale-95' : 'cursor-default'}
                    disabled:cursor-not-allowed
                  `}
                  onClick={() => handleColorClick(color)}
                  disabled={gameState !== 'input'}
                />
              ))}
            </div>

            <div className="text-center space-y-4">
              {gameState === 'showing' && (
                <div className="text-lg font-semibold animate-pulse">
                  Watch the sequence... ({showingIndex + 1}/{sequence.length})
                </div>
              )}
              
              {gameState === 'input' && (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Your turn!</div>
                  <div className="text-sm text-muted-foreground">
                    Progress: {userInput.length}/{sequence.length}
                  </div>
                </div>
              )}

              {gameState === 'gameOver' && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-destructive">Game Over!</div>
                  <div className="space-y-1">
                    <div>Level Reached: <span className="font-bold text-primary">{currentLevel}</span></div>
                    <div>Final Score: <span className="font-bold text-primary">{score}</span></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getHighScores()[0] && currentLevel >= getHighScores()[0].level ? "🏆 New Best Level!" : ""}
                  </div>
                  <Button onClick={startGame} className="btn-gaming">
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};