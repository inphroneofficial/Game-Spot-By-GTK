import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

interface RockPaperScissorsProps {
  onBack: () => void;
}

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'tie';

export const RockPaperScissors = ({ onBack }: RockPaperScissorsProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result' | 'tournamentEnd'>('menu');
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [round, setRound] = useState(1);
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const choices: { [key in Choice]: { emoji: string; beats: Choice } } = {
    rock: { emoji: '🗿', beats: 'scissors' },
    paper: { emoji: '📄', beats: 'rock' },
    scissors: { emoji: '✂️', beats: 'paper' }
  };

  const getAiChoice = (): Choice => {
    // Simple AI that adapts to player patterns
    if (playerHistory.length < 2) {
      return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as Choice;
    }

    // Look for patterns in recent moves
    const recent = playerHistory.slice(-3);
    const counts = {
      rock: recent.filter(c => c === 'rock').length,
      paper: recent.filter(c => c === 'paper').length,
      scissors: recent.filter(c => c === 'scissors').length
    };

    // Find most frequent recent choice
    let mostFrequent: Choice = 'rock';
    let maxCount = 0;
    (Object.keys(counts) as Choice[]).forEach(choice => {
      if (counts[choice] > maxCount) {
        maxCount = counts[choice];
        mostFrequent = choice;
      }
    });

    // Counter the most frequent choice with some randomness
    if (Math.random() < 0.7) {
      // Counter the predicted choice
      if (mostFrequent === 'rock') return 'paper';
      if (mostFrequent === 'paper') return 'scissors';
      return 'rock';
    } else {
      // Random choice 30% of the time
      return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as Choice;
    }
  };

  const determineWinner = (player: Choice, ai: Choice): GameResult => {
    if (player === ai) return 'tie';
    if (choices[player].beats === ai) return 'win';
    return 'lose';
  };

  const playRound = (choice: Choice) => {
    if (gameState !== 'playing') return;

    setPlayerChoice(choice);
    setPlayerHistory(prev => [...prev, choice]);
    
    // Countdown animation
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          
          // Reveal choices and determine winner
          const ai = getAiChoice();
          setAiChoice(ai);
          const roundResult = determineWinner(choice, ai);
          setResult(roundResult);
          
          // Update scores
          if (roundResult === 'win') {
            setPlayerScore(prev => prev + 1);
          } else if (roundResult === 'lose') {
            setAiScore(prev => prev + 1);
          }
          
          setGameState('result');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextRound = () => {
    if (playerScore === 3 || aiScore === 3) {
      setGameState('tournamentEnd');
      saveTournamentResult();
    } else {
      setRound(prev => prev + 1);
      setPlayerChoice(null);
      setAiChoice(null);
      setResult(null);
      setGameState('playing');
    }
  };

  const startTournament = () => {
    setPlayerScore(0);
    setAiScore(0);
    setRound(1);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setPlayerHistory([]);
    setGameState('playing');
  };

  const saveTournamentResult = () => {
    const saved = localStorage.getItem('rps-tournament-record');
    const records = saved ? JSON.parse(saved) : { wins: 0, losses: 0 };
    
    if (playerScore > aiScore) {
      records.wins++;
    } else {
      records.losses++;
    }
    
    localStorage.setItem('rps-tournament-record', JSON.stringify(records));
  };

  const getTournamentRecord = () => {
    const saved = localStorage.getItem('rps-tournament-record');
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0 };
  };

  if (gameState === 'menu') {
    const record = getTournamentRecord();

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="card-gaming w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="outline" onClick={onBack} className="w-fit mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
            <div className="text-6xl mb-4 animate-bounce-in">✂️</div>
            <CardTitle className="text-4xl font-bold mb-2">Rock Paper Scissors</CardTitle>
            <p className="text-muted-foreground">Best of 5 tournament vs Smart AI!</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p><strong>Tournament Record:</strong></p>
              <div className="text-lg">
                Wins: <span className="text-accent font-bold">{record.wins}</span> | 
                Losses: <span className="text-destructive font-bold">{record.losses}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• First to win 3 rounds wins the tournament</p>
              <p>• AI learns from your patterns</p>
              <p>• Rock beats Scissors, Scissors beat Paper, Paper beats Rock</p>
            </div>
            <Button onClick={startTournament} className="btn-gaming">
              <Play className="w-4 h-4 mr-2" />
              Start Tournament
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="card-gaming w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <div className="text-lg font-bold">Round {round}</div>
            <div className="text-sm text-muted-foreground">Best of 5</div>
          </div>
          <Button variant="outline" onClick={startTournament}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto space-y-6">
            {/* Score */}
            <div className="flex justify-between items-center text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{playerScore}</div>
                <div className="text-sm">You</div>
              </div>
              <div className="text-muted-foreground">VS</div>
              <div>
                <div className="text-2xl font-bold text-destructive">{aiScore}</div>
                <div className="text-sm">AI</div>
              </div>
            </div>

            {/* Game Area */}
            <div className="text-center space-y-6">
              {countdown !== null ? (
                <div className="text-6xl font-bold animate-pulse">
                  {countdown === 0 ? "SHOOT!" : countdown}
                </div>
              ) : (
                <>
                  {/* Choices Display */}
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">
                        {playerChoice ? choices[playerChoice].emoji : '❓'}
                      </div>
                      <div className="text-sm font-semibold">You</div>
                    </div>
                    <div className="text-center">
                      <div className="text-6xl mb-2">
                        {aiChoice ? choices[aiChoice].emoji : '❓'}
                      </div>
                      <div className="text-sm font-semibold">AI</div>
                    </div>
                  </div>

                  {/* Result */}
                  {result && (
                    <div className="space-y-4">
                      <div className={`text-2xl font-bold ${
                        result === 'win' ? 'text-accent' : 
                        result === 'lose' ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {result === 'win' && '🎉 You Win!'}
                        {result === 'lose' && '😞 You Lose!'}
                        {result === 'tie' && '🤝 It\'s a Tie!'}
                      </div>
                      
                      <Button onClick={nextRound} className="btn-gaming">
                        {playerScore === 3 || aiScore === 3 ? 'View Results' : 'Next Round'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Choice Buttons */}
            {gameState === 'playing' && !countdown && (
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(choices) as Choice[]).map((choice) => (
                  <Button
                    key={choice}
                    onClick={() => playRound(choice)}
                    variant="outline"
                    className="h-20 text-3xl hover:scale-105 transition-transform"
                  >
                    {choices[choice].emoji}
                    <span className="block text-xs mt-1 capitalize">{choice}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Tournament End */}
            {gameState === 'tournamentEnd' && (
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold">
                  {playerScore > aiScore ? '🏆 Tournament Winner!' : '😔 Tournament Lost'}
                </div>
                <div className="text-lg">
                  Final Score: {playerScore} - {aiScore}
                </div>
                <Button onClick={startTournament} className="btn-gaming">
                  New Tournament
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};