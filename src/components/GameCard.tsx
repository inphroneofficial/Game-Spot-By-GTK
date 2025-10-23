import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  difficulty?: "Easy" | "Medium" | "Hard";
  playCount?: number;
}

export const GameCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  difficulty = "Easy",
  playCount = 0 
}: GameCardProps) => {
  const difficultyColors = {
    Easy: "text-accent",
    Medium: "text-primary", 
    Hard: "text-destructive"
  };

  return (
    <Card 
      className="card-gaming cursor-pointer group animate-fade-in relative overflow-hidden"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardContent className="p-5 lg:p-7 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 lg:space-y-5">
          {/* Icon with enhanced animations */}
          <div className="relative pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-5xl lg:text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>
          </div>
          
          {/* Content with better spacing */}
          <div className="space-y-2 lg:space-y-3 w-full">
            <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed min-h-[2.5rem]">
              {description}
            </p>
          </div>
          
          {/* Stats with modern badges */}
          <div className="flex items-center justify-between w-full pt-3 lg:pt-4 border-t border-border/50">
            <span className={`text-xs lg:text-sm font-bold px-3 py-1 rounded-full ${
              difficulty === 'Easy' 
                ? 'bg-accent/15 text-accent' 
                : difficulty === 'Medium' 
                ? 'bg-primary/15 text-primary' 
                : 'bg-destructive/15 text-destructive'
            }`}>
              {difficulty}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs lg:text-sm text-muted-foreground font-medium">
                {playCount} {playCount === 1 ? 'play' : 'plays'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};