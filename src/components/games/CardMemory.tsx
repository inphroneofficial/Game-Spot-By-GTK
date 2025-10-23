import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface CardMemoryProps {
  onBack?: () => void;
}

interface CardType {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_VALUES = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹'];

export default function CardMemory({ onBack }: CardMemoryProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);

  const initializeGame = () => {
    const cardPairs = [...CARD_VALUES, ...CARD_VALUES];
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  useEffect(() => {
    if (matches === CARD_VALUES.length) {
      setGameStarted(false);
      toast.success(`Congratulations! Completed in ${moves} moves and ${time} seconds!`);
    }
  }, [matches, moves, time]);

  const handleCardClick = (id: number) => {
    if (!gameStarted || flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard?.value === secondCard?.value) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              newFlipped.includes(c.id) ? { ...c, isMatched: true } : c
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          toast.success('Match found! 🎉');
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 p-4">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Card Memory
            </h2>
            <p className="text-muted-foreground">Find all matching pairs!</p>
          </div>

          {!gameStarted ? (
            <div className="text-center space-y-4 py-12">
              <p className="text-lg">Flip cards to find matching pairs!</p>
              <Button onClick={initializeGame} size="lg">
                Start Game
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center gap-4">
                <div className="bg-primary/5 rounded-lg px-4 py-2 flex-1">
                  <div className="text-sm text-muted-foreground">Moves</div>
                  <div className="text-2xl font-bold text-primary">{moves}</div>
                </div>
                <div className="bg-primary/5 rounded-lg px-4 py-2 flex-1">
                  <div className="text-sm text-muted-foreground">Matches</div>
                  <div className="text-2xl font-bold text-primary">{matches}/{CARD_VALUES.length}</div>
                </div>
                <div className="bg-primary/5 rounded-lg px-4 py-2 flex-1">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="text-2xl font-bold text-primary">{time}s</div>
                </div>
                <Button variant="outline" size="sm" onClick={initializeGame}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isMatched || card.isFlipped}
                    className={`aspect-square rounded-lg text-4xl flex items-center justify-center transition-all duration-300 transform ${
                      card.isFlipped || card.isMatched
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white scale-105'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 hover:scale-105'
                    } ${
                      card.isMatched ? 'opacity-50' : ''
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? card.value : '❓'}
                  </button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
