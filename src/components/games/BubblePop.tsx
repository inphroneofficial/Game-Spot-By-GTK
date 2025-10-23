import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface BubblePopProps {
  onBack?: () => void;
}

interface Bubble {
  x: number;
  y: number;
  color: string;
  radius: number;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function BubblePop({ onBack }: BubblePopProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const createBubble = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    return {
      x: Math.random() * (canvas.width - 60) + 30,
      y: canvas.height + 30,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      radius: 20 + Math.random() * 20,
    };
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
  };

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          toast.success(`Game Over! Final Score: ${score}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive, score]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      const newBubble = createBubble();
      if (newBubble) {
        setBubbles(prev => [...prev, newBubble]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({ ...bubble, y: bubble.y - 2 }))
          .filter(bubble => bubble.y > -50)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.min(500, window.innerHeight * 0.6);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.radius / 3,
          bubble.y - bubble.radius / 3,
          0,
          bubble.x,
          bubble.y,
          bubble.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    draw();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [bubbles]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let popped = false;
    setBubbles(prev => 
      prev.filter(bubble => {
        const distance = Math.sqrt((bubble.x - x) ** 2 + (bubble.y - y) ** 2);
        if (distance <= bubble.radius && !popped) {
          popped = true;
          setScore(s => s + Math.floor(bubble.radius));
          toast.success(`+${Math.floor(bubble.radius)} points!`);
          return false;
        }
        return true;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-4">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Bubble Pop
            </h2>
            <p className="text-muted-foreground">Pop the bubbles before they float away!</p>
          </div>

          {!gameActive ? (
            <div className="text-center space-y-4 py-12">
              <p className="text-lg">Click bubbles to pop them and score points!</p>
              <Button onClick={startGame} size="lg">
                Start Game
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="bg-primary/5 rounded-lg px-4 py-2">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-2xl font-bold text-primary">{score}</div>
                </div>
                <div className="bg-primary/5 rounded-lg px-4 py-2">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="text-2xl font-bold text-primary">{timeLeft}s</div>
                </div>
                <Button variant="outline" size="sm" onClick={startGame}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full border-2 border-primary/20 rounded-lg bg-gradient-to-b from-blue-100 to-cyan-100 dark:from-gray-800 dark:to-blue-900 cursor-pointer"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
