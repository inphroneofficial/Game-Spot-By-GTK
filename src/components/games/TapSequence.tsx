import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface TapSequenceProps {
  onBack: () => void;
}

export const TapSequence = ({ onBack }: TapSequenceProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [level, setLevel] = useState(1);
  const [highlightedTile, setHighlightedTile] = useState<number | null>(null);

  const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const startGame = () => {
    setLevel(1);
    setSequence([]);
    setPlayerSequence([]);
    setGameActive(true);
    nextRound([]);
  };

  const nextRound = (currentSeq: number[]) => {
    const newNumber = Math.floor(Math.random() * 9);
    const newSequence = [...currentSeq, newNumber];
    setSequence(newSequence);
    setPlayerSequence([]);
    showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (let i = 0; i < seq.length; i++) {
      setHighlightedTile(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedTile(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setShowingSequence(false);
  };

  const handleTileClick = (index: number) => {
    if (!gameActive || showingSequence) return;

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    const currentIndex = newPlayerSeq.length - 1;
    
    if (newPlayerSeq[currentIndex] !== sequence[currentIndex]) {
      toast.error("Wrong tile! Game Over!");
      setGameActive(false);
      
      const bestLevel = parseInt(localStorage.getItem("tap-sequence-best") || "0");
      if (level > bestLevel) {
        localStorage.setItem("tap-sequence-best", level.toString());
        toast.success("🎉 New record!");
      }
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      toast.success("Correct! Next level!");
      setLevel(prev => prev + 1);
      setTimeout(() => nextRound(sequence), 1000);
    }
  };

  const getTileColor = (index: number) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500", 
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-teal-500"
    ];
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Tap Sequence</h1>
          <Button variant="outline" onClick={startGame} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="card-gaming p-6 sm:p-8 text-center mb-8">
          <div className="text-4xl sm:text-6xl mb-4">🎯</div>
          <div className="text-xl sm:text-2xl mb-4">
            Level: <span className="text-primary font-bold">{level}</span>
          </div>
          <div className="text-base sm:text-lg text-muted-foreground mb-4">
            {showingSequence && "Watch carefully..."}
            {!showingSequence && gameActive && `Tap ${sequence.length} tiles`}
            {!gameActive && "Ready to play?"}
          </div>
          {!gameActive && (
            <Button className="btn-gaming text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6" onClick={startGame}>
              Start Game
            </Button>
          )}
        </div>

        <div className="card-gaming p-4 sm:p-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto">
            {tiles.map((tile) => (
              <button
                key={tile}
                onClick={() => handleTileClick(tile)}
                disabled={!gameActive || showingSequence}
                className={`
                  aspect-square rounded-xl sm:rounded-2xl transition-all duration-200
                  ${getTileColor(tile)}
                  ${highlightedTile === tile ? "scale-110 brightness-150 shadow-2xl" : "brightness-75"}
                  ${!gameActive || showingSequence ? "cursor-not-allowed opacity-50" : "cursor-pointer active:scale-95"}
                  touch-manipulation
                `}
              />
            ))}
          </div>
        </div>

        <div className="card-gaming p-6 mt-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4">How to Play</h3>
          <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>• Watch the tiles light up in sequence</li>
            <li>• Tap the tiles in the same order</li>
            <li>• Each level adds one more tile</li>
            <li>• One wrong tap ends the game</li>
            <li>• How far can you go?</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
