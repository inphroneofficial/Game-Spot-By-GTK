import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface StackTowerProps {
  onBack?: () => void;
}

interface Block {
  x: number;
  width: number;
  color: string;
}

export default function StackTower({ onBack }: StackTowerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [direction, setDirection] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef<number>();

  const BLOCK_HEIGHT = 30;
  const INITIAL_WIDTH = 150;
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#E056FD', '#686DE0'];

  const startGame = () => {
    setBlocks([{
      x: 125,
      width: INITIAL_WIDTH,
      color: COLORS[0]
    }]);
    setCurrentBlock({
      x: 0,
      width: INITIAL_WIDTH,
      color: COLORS[1]
    });
    setDirection(1);
    setGameActive(true);
    setGameOver(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = 400;
        canvas.height = 500;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (!gameActive || !currentBlock) return;

    const moveBlock = () => {
      setCurrentBlock(prev => {
        if (!prev) return null;
        const canvas = canvasRef.current;
        if (!canvas) return prev;

        let newX = prev.x + direction * 3;
        let newDir = direction;

        if (newX <= 0 || newX + prev.width >= canvas.width) {
          newDir = -direction;
          newX = prev.x + newDir * 3;
          setDirection(newDir);
        }

        return { ...prev, x: newX };
      });

      animationRef.current = requestAnimationFrame(moveBlock);
    };

    animationRef.current = requestAnimationFrame(moveBlock);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, direction, currentBlock]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stacked blocks
    blocks.forEach((block, index) => {
      const y = canvas.height - (index + 1) * BLOCK_HEIGHT;
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, y, block.width, BLOCK_HEIGHT);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, y, block.width, BLOCK_HEIGHT);
    });

    // Draw current block
    if (currentBlock && gameActive) {
      const y = canvas.height - (blocks.length + 1) * BLOCK_HEIGHT;
      ctx.fillStyle = currentBlock.color;
      ctx.fillRect(currentBlock.x, y, currentBlock.width, BLOCK_HEIGHT);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(currentBlock.x, y, currentBlock.width, BLOCK_HEIGHT);
    }
  }, [blocks, currentBlock, gameActive]);

  const dropBlock = () => {
    if (!currentBlock || !gameActive) return;

    const lastBlock = blocks[blocks.length - 1];
    const overlap = Math.min(
      currentBlock.x + currentBlock.width,
      lastBlock.x + lastBlock.width
    ) - Math.max(currentBlock.x, lastBlock.x);

    if (overlap <= 0) {
      setGameActive(false);
      setGameOver(true);
      toast.error(`Game Over! Height: ${blocks.length}`);
      return;
    }

    const newX = Math.max(currentBlock.x, lastBlock.x);
    const newWidth = overlap;

    const newBlock = {
      x: newX,
      width: newWidth,
      color: currentBlock.color
    };

    setBlocks(prev => [...prev, newBlock]);

    if (newWidth < 20) {
      setGameActive(false);
      setGameOver(true);
      toast.success(`Great! Final Height: ${blocks.length + 1}`);
      return;
    }

    const nextColor = COLORS[(blocks.length + 1) % COLORS.length];
    setCurrentBlock({
      x: 0,
      width: newWidth,
      color: nextColor
    });
  };

  const handleClick = () => {
    if (!gameActive) {
      startGame();
    } else {
      dropBlock();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <Card className="max-w-md mx-auto">
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stack Tower
            </h2>
            <p className="text-muted-foreground">Stack blocks as high as you can!</p>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Height</div>
            <div className="text-4xl font-bold text-primary">{blocks.length}</div>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full border-2 border-primary/20 rounded-lg cursor-pointer"
            onClick={handleClick}
          />

          <Button
            onClick={handleClick}
            className="w-full"
            size="lg"
          >
            {!gameActive ? 'Start Game' : 'Drop Block'}
          </Button>

          {gameOver && (
            <div className="text-center text-sm text-muted-foreground">
              Click "Start Game" to play again!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
