import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Gamepad2,
} from "lucide-react";

export interface DeveloperModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeveloperModal({ open, onOpenChange }: DeveloperModalProps) {
  const developerLinks = [
    { icon: <Github className="h-4 w-4" />, label: "GitHub", url: "https://github.com" },
    { icon: <Instagram className="h-4 w-4 text-pink-500" />, label: "Instagram", url: "https://instagram.com/g_thangella_k" },
    { icon: <Linkedin className="h-4 w-4 text-blue-600" />, label: "LinkedIn", url: "https://www.linkedin.com" },
    { icon: <Twitter className="h-4 w-4 text-blue-400" />, label: "Twitter", url: "https://twitter.com/g_thangella" },
    { icon: <Mail className="h-4 w-4 text-red-500" />, label: "Email", url: "mailto:imgtk17@gmail.com" },
    { icon: <Globe className="h-4 w-4 text-green-500" />, label: "Portfolio", url: "https://thangella-creaftech-solutions.vercel.app/" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-sm sm:max-w-md rounded-lg bg-background border border-border p-0">
        {/* Scrollable content wrapper */}
        <div
          className="max-h-[75vh] overflow-y-auto overscroll-contain p-3 sm:p-4"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        >
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg text-center flex items-center justify-center gap-2">
              <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Meet the Developer
            </DialogTitle>
            <DialogDescription className="text-center text-xs">
              Behind the GAME SPOT application
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 pt-3 sm:pt-4">
            {/* Avatar & Info */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary mb-2 sm:mb-3">
                <AvatarImage src="/GTK.png" alt="G. Thangella" />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold">GT</AvatarFallback>
              </Avatar>
              <h3 className="text-sm font-semibold text-primary">G. Thangella</h3>
              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line leading-snug">
                🎮 Game Developer{"\n"}
                🧠 Tech Innovator{"\n"}
                🎨 UI/UX Designer{"\n"}
                🚀 Digital Creator
              </p>

              <div className="flex gap-1 mt-2 flex-wrap justify-center sm:justify-start">
                {developerLinks.map((link, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    asChild
                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-full transition-colors duration-200"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                      {link.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs w-full sm:w-[60%] min-w-0">
              <p className="text-muted-foreground text-xs sm:text-sm">
                I create engaging gaming experiences that combine fun with cognitive benefits. GAME SPOT represents my passion for interactive entertainment and brain training.
              </p>

              <div>
                <h4 className="font-medium text-xs sm:text-sm mb-1 text-accent">Tech Stack</h4>
                <p className="text-muted-foreground text-xs">
                  React, TypeScript, TailwindCSS, Shadcn/ui, Lucide Icons, Vite
                </p>
              </div>

              <div>
                <h4 className="font-medium text-xs sm:text-sm mb-1 text-secondary">Why Simple Games?</h4>
                <p className="text-muted-foreground text-xs">
                  Big games need high-end devices and gigabytes of storage. These simple games run smoothly on any device - from old phones to new laptops. No downloads, no stress, just instant fun and relaxation!
                </p>
              </div>

              <div>
                <h4 className="font-medium text-xs sm:text-sm mb-1 text-accent">Mission</h4>
                <p className="text-muted-foreground text-xs">
                  Building addictive games that enhance cognitive abilities while providing pure entertainment. No ads, no data collection - just fun!
                </p>
              </div>

              <div className="flex flex-wrap gap-1 pt-2">
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/10 text-primary text-xs rounded-full">🔒 Privacy First</span>
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-accent/10 text-accent text-xs rounded-full">📱 Mobile Ready</span>
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-secondary/10 text-secondary text-xs rounded-full">🎮 18 Games</span>
              </div>
            </div>
          </div>

          <Separator className="my-2 sm:my-3" />
        </div>

        {/* Footer OUTSIDE scroll */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end p-3 sm:p-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs sm:text-sm"
          >
            Close
          </Button>
          <Button
            asChild
            className="text-xs sm:text-sm bg-primary hover:bg-primary/90"
          >
            <a href="mailto:imgtk17@gmail.com" target="_blank" rel="noopener noreferrer">
              Get in Touch
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
