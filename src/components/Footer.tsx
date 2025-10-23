import { Brain } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Developed with</span>
            <Brain className="h-4 w-4 text-purple-500 fill-current animate-glow" />
            <span>by</span>
            <span className="text-primary font-bold">G.Thangella</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground/60">
            Premium Gaming Experience • No Ads • No Signup Required
          </div>
        </div>
      </div>
    </footer>
  );
};
