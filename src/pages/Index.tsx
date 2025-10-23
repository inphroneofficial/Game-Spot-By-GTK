import { useState } from "react";
import { GameCard } from "@/components/GameCard";
import { GameInstructions } from "@/components/GameInstructions";
import { Footer } from "@/components/Footer";
import { DeveloperModal } from "@/components/DeveloperModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DateTimeDisplay } from "@/components/DateTimeDisplay";
import { MemoryGame } from "@/components/games/MemoryGame";
import { SnakeGame } from "@/components/games/SnakeGame";
import { TicTacToe } from "@/components/games/TicTacToe";
import { ColorRush } from "@/components/games/ColorRush";
import { ColorMatch } from "@/components/games/ColorMatch";
import { NumberGame } from "@/components/games/NumberGame";
import { PuzzleSlider } from "@/components/games/PuzzleSlider";
import { WordGuess } from "@/components/games/WordGuess";
import { SimpleSudoku } from "@/components/games/SimpleSudoku";
import { Breakout } from "@/components/games/Breakout";
import { Minesweeper } from "@/components/games/Minesweeper";
import { Game2048 } from "@/components/games/Game2048";
import { WhackMole } from "@/components/games/WhackMole";
import { SimonSays } from "@/components/games/SimonSays";
import { RockPaperScissors } from "@/components/games/RockPaperScissors";
import { TypingTest } from "@/components/games/TypingTest";
import { MathQuiz } from "@/components/games/MathQuiz";
import { SpeedClicker } from "@/components/games/SpeedClicker";
import { ReactionTimer } from "@/components/games/ReactionTimer";
import { Tetris } from "@/components/games/Tetris";
import { ConnectFour } from "@/components/games/ConnectFour";
import { FlappyBird } from "@/components/games/FlappyBird";
import { MatchThree } from "@/components/games/MatchThree";
import { ColorSwipe } from "@/components/games/ColorSwipe";
import { TapSequence } from "@/components/games/TapSequence";
import { QuickMath } from "@/components/games/QuickMath";
import { PatternMatch } from "@/components/games/PatternMatch";
import WordScramble from "@/components/games/WordScramble";
import BubblePop from "@/components/games/BubblePop";
import StackTower from "@/components/games/StackTower";
import CardMemory from "@/components/games/CardMemory";
import DrumKit from "@/components/games/DrumKit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Zap, Target, Info, Users, Baby, Gamepad2, Lightbulb, User, Shield, Clock } from "lucide-react";
import { GAME_DATA, AGE_CATEGORIES, GameType, AgeCategory, GameData } from "@/data/gameData";

const Index = () => {
  const [currentGame, setCurrentGame] = useState<GameType>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<AgeCategory | 'all'>('all');
  const [showInstructions, setShowInstructions] = useState<GameData | null>(null);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);

  const getGameStats = (gameKey: string) => {
    const savedData = localStorage.getItem(`${gameKey}`) || localStorage.getItem(`${gameKey}`);
    if (!savedData) return 0;
    
    try {
      const data = JSON.parse(savedData);
      return Array.isArray(data) ? data.length : 1;
    } catch {
      return localStorage.getItem(`${gameKey}`) ? 1 : 0;
    }
  };

  const filteredGames = selectedCategory === 'all' 
    ? GAME_DATA 
    : GAME_DATA.filter(game => game.ageCategory === selectedCategory);

  const renderGame = () => {
    switch (currentGame) {
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('dashboard')} />;
      case 'snake':
        return <SnakeGame onBack={() => setCurrentGame('dashboard')} />;
      case 'tictactoe':
        return <TicTacToe onBack={() => setCurrentGame('dashboard')} />;
      case 'color-rush':
        return <ColorRush onBack={() => setCurrentGame('dashboard')} />;
      case 'color-match':
        return <ColorMatch onBack={() => setCurrentGame('dashboard')} />;
      case 'number-game':
        return <NumberGame onBack={() => setCurrentGame('dashboard')} />;
      case 'puzzle-slider':
        return <PuzzleSlider onBack={() => setCurrentGame('dashboard')} />;
      case 'word-guess':
        return <WordGuess onBack={() => setCurrentGame('dashboard')} />;
      case 'simple-sudoku':
        return <SimpleSudoku onBack={() => setCurrentGame('dashboard')} />;
      case 'breakout':
        return <Breakout onBack={() => setCurrentGame('dashboard')} />;
      case 'minesweeper':
        return <Minesweeper onBack={() => setCurrentGame('dashboard')} />;
      case 'game-2048':
        return <Game2048 onBack={() => setCurrentGame('dashboard')} />;
      case 'whack-mole':
        return <WhackMole onBack={() => setCurrentGame('dashboard')} />;
      case 'simon-says':
        return <SimonSays onBack={() => setCurrentGame('dashboard')} />;
      case 'rock-paper-scissors':
        return <RockPaperScissors onBack={() => setCurrentGame('dashboard')} />;
      case 'typing-test':
        return <TypingTest onBack={() => setCurrentGame('dashboard')} />;
      case 'math-quiz':
        return <MathQuiz onBack={() => setCurrentGame('dashboard')} />;
      case 'speed-clicker':
        return <SpeedClicker onBack={() => setCurrentGame('dashboard')} />;
      case 'reaction-timer':
        return <ReactionTimer onBack={() => setCurrentGame('dashboard')} />;
      case 'tetris':
        return <Tetris onBack={() => setCurrentGame('dashboard')} />;
      case 'connect-four':
        return <ConnectFour onBack={() => setCurrentGame('dashboard')} />;
      case 'flappy-bird':
        return <FlappyBird onBack={() => setCurrentGame('dashboard')} />;
      case 'match-three':
        return <MatchThree onBack={() => setCurrentGame('dashboard')} />;
      case 'color-swipe':
        return <ColorSwipe onBack={() => setCurrentGame('dashboard')} />;
      case 'tap-sequence':
        return <TapSequence onBack={() => setCurrentGame('dashboard')} />;
      case 'quick-math':
        return <QuickMath onBack={() => setCurrentGame('dashboard')} />;
      case 'pattern-match':
        return <PatternMatch onBack={() => setCurrentGame('dashboard')} />;
      case 'word-scramble':
        return <WordScramble onBack={() => setCurrentGame('dashboard')} />;
      case 'bubble-pop':
        return <BubblePop onBack={() => setCurrentGame('dashboard')} />;
      case 'stack-tower':
        return <StackTower onBack={() => setCurrentGame('dashboard')} />;
      case 'card-memory':
        return <CardMemory onBack={() => setCurrentGame('dashboard')} />;
      case 'drum-kit':
        return <DrumKit onBack={() => setCurrentGame('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-background">
            {/* Fixed UI Elements */}
            <DateTimeDisplay />
            <ThemeToggle />
            
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
              </div>
              
              <div className="container mx-auto px-4 py-24 lg:py-32 relative">
                <div className="text-center animate-slide-up">
                  <div className="flex justify-center mb-8 lg:mb-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full blur-2xl opacity-50 animate-pulse" />
                      <div className="relative p-8 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 backdrop-blur-xl border border-white/20 animate-float">
                        <span className="text-7xl lg:text-8xl">🎮</span>
                      </div>
                    </div>
                  </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-bounce-in leading-tight">
              Game Spot
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 font-medium">
              Your premium collection of <span className="text-primary font-bold">addictive mini-games</span> for all ages. 
              Challenge yourself, beat your scores, and have <span className="text-secondary font-bold">endless fun</span>!
            </p>
                  
                  {/* Privacy & Ad-Free Notice */}
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="glass flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-accent/10 border-accent/20 group hover:bg-accent/20 transition-all duration-300">
                      <Shield className="h-4 sm:h-5 w-4 sm:w-5 text-accent group-hover:scale-110 transition-transform" />
                      <span className="text-sm sm:text-base font-bold text-accent">100% Ad-Free</span>
                    </div>
                    <div className="glass flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-primary/10 border-primary/20 group hover:bg-primary/20 transition-all duration-300">
                      <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm sm:text-base font-bold text-primary">No Data Collection</span>
                    </div>
                    <div className="glass flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-secondary/10 border-secondary/20 group hover:bg-secondary/20 transition-all duration-300">
                      <Zap className="h-4 sm:h-5 w-4 sm:w-5 text-secondary group-hover:scale-110 transition-transform" />
                      <span className="text-sm sm:text-base font-bold text-secondary">Just Come & Play!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-20 lg:py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7 max-w-6xl mx-auto mb-20">
                  <div className="card-gaming p-6 lg:p-8 text-center animate-fade-in transition-all duration-300 group">
                    <div className="relative inline-block mb-4 lg:mb-6">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all" />
                      <Trophy className="relative h-12 lg:h-16 w-12 lg:w-16 mx-auto text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">33 Games</h3>
                    <p className="text-muted-foreground text-sm lg:text-base font-medium">Diverse collection for all skill levels</p>
                  </div>
                  <div className="card-gaming p-6 lg:p-8 text-center animate-fade-in transition-all duration-300 group" style={{ animationDelay: '0.1s' }}>
                    <div className="relative inline-block mb-4 lg:mb-6">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/30 transition-all" />
                      <Star className="relative h-12 lg:h-16 w-12 lg:w-16 mx-auto text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3 bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">No Ads</h3>
                    <p className="text-muted-foreground text-sm lg:text-base font-medium">Pure gaming experience</p>
                  </div>
                  <div className="card-gaming p-6 lg:p-8 text-center animate-fade-in transition-all duration-300 group" style={{ animationDelay: '0.2s' }}>
                    <div className="relative inline-block mb-4 lg:mb-6">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/30 transition-all" />
                      <Shield className="relative h-12 lg:h-16 w-12 lg:w-16 mx-auto text-accent group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3 bg-gradient-to-br from-accent to-secondary bg-clip-text text-transparent">Privacy First</h3>
                    <p className="text-muted-foreground text-sm lg:text-base font-medium">No data collection</p>
                  </div>
                  <div className="card-gaming p-6 lg:p-8 text-center animate-fade-in transition-all duration-300 group" style={{ animationDelay: '0.3s' }}>
                    <div className="relative inline-block mb-4 lg:mb-6">
                      <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl group-hover:bg-secondary/30 transition-all" />
                      <Zap className="relative h-12 lg:h-16 w-12 lg:w-16 mx-auto text-secondary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-2 lg:mb-3 bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">Instant Play</h3>
                    <p className="text-muted-foreground text-sm lg:text-base font-medium">No downloads required</p>
                  </div>
                </div>

              {/* Age Categories */}
              <div className="mb-16">
                <div className="flex flex-col items-center justify-center mb-8 sm:mb-10">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                    <Users className="relative h-10 sm:h-12 w-10 sm:w-12 text-primary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Choose Your Age Group
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-3 max-w-2xl text-center">
                    Games designed and categorized for different age groups and skill levels
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-center gap-2"
                  >
                    <Gamepad2 className="h-4 w-4" />
                    All Games
                  </Button>
                  {Object.entries(AGE_CATEGORIES).map(([key, category]) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(key as AgeCategory)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">{category.icon}</span>
                      {category.title}
                    </Button>
                  ))}
                </div>

                {selectedCategory !== 'all' && (
                  <Card className="card-gaming max-w-2xl mx-auto mb-8 animate-fade-in">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{AGE_CATEGORIES[selectedCategory as AgeCategory].icon}</div>
                      <h3 className="text-2xl font-bold mb-2">
                        {AGE_CATEGORIES[selectedCategory as AgeCategory].title}
                      </h3>
                      <p className="text-lg text-primary font-semibold mb-2">
                        {AGE_CATEGORIES[selectedCategory as AgeCategory].subtitle}
                      </p>
                      <p className="text-muted-foreground">
                        {AGE_CATEGORIES[selectedCategory as AgeCategory].description}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Games Grid */}
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center mb-10 sm:mb-14">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl" />
                    <Target className="relative h-10 sm:h-12 w-10 sm:w-12 text-secondary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    {selectedCategory === 'all' ? 'All Games' : `${AGE_CATEGORIES[selectedCategory as AgeCategory]?.title} Games`}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filteredGames.map((game, index) => (
                    <div 
                      key={game.id}
                      className="animate-fade-in relative group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <GameCard
                        title={game.title}
                        description={game.description}
                        icon={<span className="text-4xl lg:text-6xl">{game.icon}</span>}
                        onClick={() => setCurrentGame(game.id)}
                        difficulty={game.difficulty}
                        playCount={getGameStats(game.storageKey)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInstructions(game);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <Info className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-background/80 rounded-full">
                        {game.minAge}-{game.maxAge === 99 ? '+' : game.maxAge} years
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Educational Benefits Section */}
              <div className="max-w-6xl mx-auto mt-20">
                {/* Game Philosophy Section */}
                <Card className="card-gaming p-4 sm:p-8 animate-fade-in mb-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl sm:text-6xl mb-4">🎮</div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Simple Games?</h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-4xl mx-auto leading-relaxed">
                      Big games require high-end devices, huge downloads (10GB+), constant updates, and powerful graphics cards. 
                      Our simple games run perfectly on any device - from old phones to new laptops. No downloads, no waiting, 
                      no stress. Just instant fun, relaxation, and brain training whenever you need it!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">⚡</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Instant Play</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">No downloads or installations needed</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📱</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-secondary text-sm sm:text-base">Any Device</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Works on phones, tablets, and computers</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">😌</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-accent text-sm sm:text-base">Stress Relief</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Quick breaks from daily stress</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🧠</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Brain Training</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Improve memory and cognitive skills</p>
                    </div>
                  </div>
                </Card>

                <Card className="card-gaming p-4 sm:p-8 animate-fade-in">
                  <div className="text-center mb-6 sm:mb-8">
                    <Lightbulb className="h-8 sm:h-12 w-8 sm:w-12 mx-auto mb-3 sm:mb-4 text-accent" />
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Gaming Benefits for Your Brain</h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                      Our games are designed to enhance cognitive abilities while having fun. Here's how gaming helps:
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🧠</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Memory Enhancement</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Memory games improve working memory and recall abilities</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">⚡</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-secondary text-sm sm:text-base">Reaction Time</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Fast-paced games enhance reflexes and processing speed</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔍</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-accent text-sm sm:text-base">Problem Solving</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Puzzle games develop logical thinking and strategy</p>
                    </div>
                    <div className="text-center p-3 sm:p-4">
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
                      <h3 className="font-bold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Focus & Attention</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Games improve concentration and sustained attention</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-16">
                <div className="card-gaming p-8 max-w-2xl mx-auto animate-fade-in">
                  <h3 className="text-3xl font-bold mb-4">Ready to Play?</h3>
                  <p className="text-muted-foreground mb-6">
                    Pick any game above to start your gaming session. 
                    Your progress is automatically saved locally on your device.
                    No internet required after loading!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Button 
                      className="btn-gaming"
                      onClick={() => setCurrentGame('color-match')}
                    >
                      Kids: Color Match
                    </Button>
                    <Button 
                      className="btn-gaming"
                      onClick={() => setCurrentGame('memory')}
                    >
                      Teens: Memory Game
                    </Button>
                    <Button 
                      className="btn-gaming"
                      onClick={() => setCurrentGame('simple-sudoku')}
                    >
                      Adults: Sudoku
                    </Button>
                  </div>
                  
                  {/* Developer Credit */}
                  <div className="pt-4 border-t border-muted">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeveloperModal(true)}
                      className="flex items-center gap-2 mx-auto transition-all duration-200"
                    >
                      <User className="h-4 w-4" />
                      Meet the Developer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Footer />
          </div>
        );
    }
  };

  return (
    <>
      {renderGame()}
      {showInstructions && (
        <GameInstructions
          game={showInstructions}
          onClose={() => setShowInstructions(null)}
        />
      )}
      <DeveloperModal 
        open={showDeveloperModal} 
        onOpenChange={setShowDeveloperModal} 
      />
    </>
  );
};

export default Index;