import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface DrumKitProps {
  onBack?: () => void;
}

interface Drum {
  id: string;
  key: string;
  label: string;
  color: string;
  sound: string;
}

const DRUMS: Drum[] = [
  { id: 'kick', key: 'Q', label: 'Kick', color: 'from-red-400 to-red-600', sound: '🥁' },
  { id: 'snare', key: 'W', label: 'Snare', color: 'from-blue-400 to-blue-600', sound: '🎵' },
  { id: 'hihat', key: 'E', label: 'Hi-Hat', color: 'from-yellow-400 to-yellow-600', sound: '🎶' },
  { id: 'tom1', key: 'A', label: 'Tom 1', color: 'from-green-400 to-green-600', sound: '🎸' },
  { id: 'tom2', key: 'S', label: 'Tom 2', color: 'from-purple-400 to-purple-600', sound: '🎹' },
  { id: 'tom3', key: 'D', label: 'Tom 3', color: 'from-pink-400 to-pink-600', sound: '🎺' },
  { id: 'crash', key: 'Z', label: 'Crash', color: 'from-orange-400 to-orange-600', sound: '💥' },
  { id: 'ride', key: 'X', label: 'Ride', color: 'from-teal-400 to-teal-600', sound: '✨' },
  { id: 'clap', key: 'C', label: 'Clap', color: 'from-indigo-400 to-indigo-600', sound: '👏' },
];

export default function DrumKit({ onBack }: DrumKitProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pattern, setPattern] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const playDrum = (drum: Drum) => {
    setActiveKey(drum.id);
    
    if (isRecording) {
      setPattern(prev => [...prev, drum.sound]);
    }

    // Visual feedback
    setTimeout(() => setActiveKey(null), 200);

    // Audio feedback (simulated with Web Audio API tones)
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      const frequencies: { [key: string]: number } = {
        kick: 60,
        snare: 200,
        hihat: 800,
        tom1: 150,
        tom2: 120,
        tom3: 100,
        crash: 1000,
        ride: 600,
        clap: 400,
      };

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequencies[drum.id] || 440;
      oscillator.type = drum.id === 'hihat' || drum.id === 'crash' ? 'sawtooth' : 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const drum = DRUMS.find(d => d.key === e.key.toUpperCase());
    if (drum) {
      playDrum(drum);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setPattern([]);
      setIsRecording(true);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <Card className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur">
        <CardContent className="p-6 space-y-6">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          )}
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🥁 Drum Kit
            </h2>
            <p className="text-gray-300">Click pads or press keys to play!</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="gap-2"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {soundEnabled ? 'Sound On' : 'Sound Off'}
            </Button>
            <Button
              variant={isRecording ? 'destructive' : 'outline'}
              size="sm"
              onClick={toggleRecording}
            >
              {isRecording ? '⏹️ Stop Recording' : '⏺️ Record Pattern'}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {DRUMS.map((drum) => (
              <button
                key={drum.id}
                onClick={() => playDrum(drum)}
                className={`relative aspect-square rounded-xl bg-gradient-to-br ${drum.color} 
                  text-white font-bold text-xl shadow-lg transition-all duration-200
                  hover:scale-105 hover:shadow-2xl active:scale-95
                  ${activeKey === drum.id ? 'scale-95 brightness-150' : ''}
                  flex flex-col items-center justify-center gap-2`}
              >
                <span className="text-5xl">{drum.sound}</span>
                <span className="text-sm">{drum.label}</span>
                <span className="absolute top-2 right-2 text-xs bg-black/30 px-2 py-1 rounded">
                  {drum.key}
                </span>
              </button>
            ))}
          </div>

          {pattern.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-300 mb-2">Your Pattern:</div>
              <div className="flex flex-wrap gap-2">
                {pattern.map((sound, index) => (
                  <span key={index} className="text-2xl">
                    {sound}
                  </span>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPattern([])}
                className="mt-2"
              >
                Clear Pattern
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-gray-400">
            💡 Tip: Use keyboard keys Q-W-E, A-S-D, Z-X-C to play faster!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
