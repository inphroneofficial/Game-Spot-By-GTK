import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface GameInstructionsProps {
  game: {
    title: string;
    instructions: string[];
    pcInstructions?: string[];
    mobileInstructions?: string[];
    tips?: string[];
  };
  onClose: () => void;
}

export const GameInstructions = ({ game, onClose }: GameInstructionsProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="card-gaming max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{game.title} - How to Play</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary">General Instructions</h3>
            <ul className="space-y-2">
              {game.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-accent font-bold mt-1">{index + 1}.</span>
                  <span className="text-muted-foreground text-sm sm:text-base">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* PC Instructions */}
          {game.pcInstructions && game.pcInstructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-secondary flex items-center gap-2">
                🖥️ PC/Laptop Controls
              </h3>
              <ul className="space-y-2">
                {game.pcInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold mt-1">•</span>
                    <span className="text-muted-foreground text-sm sm:text-base">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Mobile Instructions */}
          {game.mobileInstructions && game.mobileInstructions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-accent flex items-center gap-2">
                📱 Mobile/Touch Controls
              </h3>
              <ul className="space-y-2">
                {game.mobileInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-1">•</span>
                    <span className="text-muted-foreground text-sm sm:text-base">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {game.tips && game.tips.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2">
                {game.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-500">💡</span>
                    <span className="text-muted-foreground text-sm sm:text-base">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="pt-4">
            <Button onClick={onClose} className="btn-gaming w-full">
              Let's Play!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};