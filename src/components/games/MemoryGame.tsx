import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface MemoryCard {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
}

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

export const MemoryGame = ({ onBack }: MemoryGameProps) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const gameEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = gameEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === EMOJIS.length) {
      setGameWon(true);
      toast("🎉 Congratulations! You won!");
      
      // Save score to localStorage
      const savedScores = JSON.parse(localStorage.getItem("memory-scores") || "[]");
      savedScores.push({ moves, date: new Date().toISOString() });
      localStorage.setItem("memory-scores", JSON.stringify(savedScores));
    }
  }, [matches, moves]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.value === secondCard.value) {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          toast("✨ Match found!");
        } else {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
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
            <h1 className="text-3xl font-bold mb-2">Memory Match</h1>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Moves: {moves}</span>
              <span>Matches: {matches}/{EMOJIS.length}</span>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={initializeGame}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`
                card-gaming cursor-pointer aspect-square flex items-center justify-center
                transition-all duration-300 transform
                ${card.isFlipped || card.isMatched ? 'scale-105' : 'hover:scale-105'}
                ${card.isMatched ? 'glow-accent' : ''}
              `}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-0 flex items-center justify-center h-full">
                <div className="text-4xl">
                  {card.isFlipped || card.isMatched ? card.value : "❓"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {gameWon && (
          <div className="text-center mt-8 animate-bounce-in">
            <h2 className="text-2xl font-bold text-accent mb-4">
              🎉 Game Complete!
            </h2>
            <p className="text-muted-foreground">
              You completed the game in {moves} moves!
            </p>
            <Button
              className="mt-4 btn-gaming"
              onClick={initializeGame}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};