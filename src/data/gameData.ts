export type GameType = 'dashboard' | 'memory' | 'snake' | 'tictactoe' | 'color-rush' | 'color-match' | 'number-game' | 'puzzle-slider' | 'word-guess' | 'simple-sudoku' | 'breakout' | 'minesweeper' | 'game-2048' | 'rock-paper-scissors' | 'whack-mole' | 'simon-says' | 'typing-test' | 'math-quiz' | 'speed-clicker' | 'reaction-timer' | 'tetris' | 'connect-four' | 'flappy-bird' | 'match-three' | 'color-swipe' | 'tap-sequence' | 'quick-math' | 'pattern-match' | 'word-scramble' | 'bubble-pop' | 'stack-tower' | 'card-memory' | 'drum-kit';

export type AgeCategory = 'kids' | 'teens' | 'adults';

export interface GameData {
  id: GameType;
  title: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ageCategory: AgeCategory;
  minAge: number;
  maxAge: number;
  instructions: string[];
  pcInstructions?: string[];
  mobileInstructions?: string[];
  tips?: string[];
  storageKey: string;
}

export const GAME_DATA: GameData[] = [
  // Kids Games (3-8 years)
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Learn colors by matching them! Perfect for young children to develop color recognition skills.',
    icon: '🎨',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 3,
    maxAge: 8,
    storageKey: 'color-match-progress',
    instructions: [
      "Look at the color name displayed on screen",
      "Click on the matching color from the grid below", 
      "Get points for each correct match",
      "Try to get a perfect streak!"
    ],
    tips: [
      "Take your time to look carefully at each color",
      "Say the color name out loud to help remember",
      "The more you play, the faster you'll get!"
    ]
  },
  {
    id: 'number-game',
    title: 'Number Hunt',
    description: 'Find and click the right numbers! Helps children learn number recognition and counting.',
    icon: '🔢',
    difficulty: 'Easy', 
    ageCategory: 'kids',
    minAge: 4,
    maxAge: 9,
    storageKey: 'number-game-progress',
    instructions: [
      "Look at the big number shown on screen",
      "Find and click that same number in the grid below",
      "Each correct answer gives you points",
      "The game gets harder as you level up"
    ],
    tips: [
      "Count out loud to help recognize numbers",
      "Start with smaller numbers and work your way up",
      "Practice makes perfect!"
    ]
  },

  // Teen Games (9-15 years)
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards. Remember the positions and find all matches!',
    icon: '🧠',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 16,
    storageKey: 'memory-scores',
    instructions: [
      "Click on any card to flip it over",
      "Click on another card to find its match",
      "If the cards match, they stay flipped",
      "If they don't match, they flip back over",
      "Try to match all pairs with the fewest moves"
    ],
    tips: [
      "Try to remember where you saw each symbol",
      "Start by flipping cards in corners and edges",
      "Focus on one area at a time"
    ]
  },
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Control the snake to eat food and grow longer. Avoid hitting walls or yourself!',
    icon: '🐍',
    difficulty: 'Easy',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 18,
    storageKey: 'snake-high-score',
    instructions: [
      "Control the snake to eat food and grow longer",
      "Avoid hitting walls or your own tail",
      "Try to beat your high score!"
    ],
    pcInstructions: [
      "Use arrow keys (↑↓←→) to control the snake's direction",
      "Press spacebar to pause/unpause the game",
      "Eat the red food to grow longer and score points"
    ],
    mobileInstructions: [
      "Swipe in any direction to control the snake",
      "Tap the pause button to pause/unpause",
      "Eat the red food to grow longer and score points"
    ],
    tips: [
      "Plan your path ahead of time",
      "Don't make sudden direction changes",
      "Use the edges wisely but don't get trapped"
    ]
  },
  {
    id: 'puzzle-slider',
    title: 'Puzzle Slider',
    description: 'Arrange numbered tiles in the correct order. A classic brain teaser that improves logic!',
    icon: '🧩',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 10,
    maxAge: 18,
    storageKey: 'puzzle-slider-best',
    instructions: [
      "Move tiles next to the empty space to rearrange them",
      "Arrange numbers 1-8 in order from left to right, top to bottom",
      "Try to solve it in the fewest moves possible"
    ],
    pcInstructions: [
      "Click on tiles next to the empty space to move them",
      "Use mouse clicks to slide tiles into position"
    ],
    mobileInstructions: [
      "Tap on tiles next to the empty space to move them",
      "Touch and slide tiles into the correct position"
    ],
    tips: [
      "Solve the top row first, then work downwards",
      "Sometimes you need to move pieces backwards to make progress",
      "Practice makes the patterns more familiar"
    ]
  },

  // Adult Games (16+ years)
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    description: 'Classic strategy game. Get three in a row to win. Play against smart AI or friends!',
    icon: '⭕',
    difficulty: 'Easy',
    ageCategory: 'adults',
    minAge: 6,
    maxAge: 99,
    storageKey: 'tictactoe-scores',
    instructions: [
      "Choose to play against AI or another human",
      "Take turns placing X or O on the 3x3 grid",
      "Get three of your symbols in a row to win",
      "Rows, columns, and diagonals all count",
      "Block your opponent while planning your own moves"
    ],
    tips: [
      "Control the center square when possible",
      "Always block your opponent's winning moves",
      "Try to create two winning opportunities at once"
    ]
  },
  {
    id: 'word-guess',
    title: 'Word Guess',
    description: 'Guess the hidden word letter by letter. Use hints wisely and avoid wrong guesses!',
    icon: '📝',
    difficulty: 'Medium',
    ageCategory: 'adults',
    minAge: 12,
    maxAge: 99,
    storageKey: 'word-guess-progress',
    instructions: [
      "Try to guess the hidden word one letter at a time",
      "Type a letter and press Enter or click Guess",
      "Correct letters will appear in the word",
      "Wrong letters count against you",
      "Use hints if you're stuck, but they reduce your score"
    ],
    tips: [
      "Start with common vowels: A, E, I, O, U",
      "Try frequent consonants: R, S, T, L, N",
      "Use the hint to narrow down possibilities"
    ]
  },
  {
    id: 'color-rush',
    title: 'Color Rush',
    description: 'Fast-paced color matching game. Match words with their colors as quickly as possible!',
    icon: '🌈',
    difficulty: 'Hard',
    ageCategory: 'adults', 
    minAge: 14,
    maxAge: 99,
    storageKey: 'color-rush-high-score',
    instructions: [
      "Look at the color word displayed on screen",
      "Check if the word's text color matches the color it names",
      "Click 'Match' if they match, 'No Match' if they don't",
      "You have 30 seconds to score as many points as possible",
      "Correct answers give +10 points, wrong answers give -5 points"
    ],
    tips: [
      "Read the word AND look at its color quickly",
      "Don't just read the word - pay attention to the color!",
      "Speed matters, but accuracy matters more"
    ]
  },
  {
    id: 'simple-sudoku',
    title: 'Simple Sudoku',
    description: 'Logical number puzzle with 4x4 grids. Perfect introduction to Sudoku for beginners!',
    icon: '🧮',
    difficulty: 'Hard',
    ageCategory: 'adults',
    minAge: 12,
    maxAge: 99,
    storageKey: 'sudoku-progress',
    instructions: [
      "Fill the 4×4 grid with numbers 1-4",
      "Each row must contain all numbers 1-4",
      "Each column must contain all numbers 1-4", 
      "Each 2×2 box must contain all numbers 1-4",
      "Click a cell to select it, then click a number to place it"
    ],
    tips: [
      "Look for cells with only one possible number",
      "Use elimination - cross out impossible numbers",
      "Focus on one row, column, or box at a time"
    ]
  },

  // Additional Kids Games
  {
    id: 'whack-mole',
    title: 'Whack-a-Mole',
    description: 'Quick reaction game! Hit the moles as they pop up. Great for reflexes and hand-eye coordination.',
    icon: '🔨',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 4,
    maxAge: 10,
    storageKey: 'whack-mole-scores',
    instructions: [
      "Moles will pop up randomly from holes",
      "Click or tap on the moles quickly to hit them",
      "You get points for each successful hit",
      "Game lasts for 30 seconds",
      "Try to hit as many moles as possible!"
    ],
    tips: [
      "Keep your finger ready to tap quickly",
      "Watch all holes at once",
      "Don't tap empty holes - it reduces your score"
    ]
  },
  {
    id: 'simon-says',
    title: 'Simon Says',
    description: 'Memory and pattern game with colors and sounds. Follow the sequence to advance!',
    icon: '🎵',
    difficulty: 'Medium',
    ageCategory: 'kids',
    minAge: 5,
    maxAge: 12,
    storageKey: 'simon-says-progress',
    instructions: [
      "Watch the sequence of colors that light up",
      "Click the colors in the exact same order",
      "Each round adds one more color to remember",
      "One mistake ends the game",
      "See how long a sequence you can remember!"
    ],
    tips: [
      "Focus on the pattern, not just individual colors",
      "Use rhythm to help remember the sequence", 
      "Take your time - there's no rush"
    ]
  },

  // Additional Teen Games
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Classic brick-breaking game. Control the paddle to keep the ball bouncing and destroy all bricks!',
    icon: '🧱',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 18,
    storageKey: 'breakout-high-score',
    instructions: [
      "Control the paddle to keep the ball bouncing",
      "Hit bricks to destroy them and score points",
      "Clear all bricks to advance to the next level"
    ],
    pcInstructions: [
      "Move your mouse left and right to control the paddle",
      "Click to start the game and serve the ball"
    ],
    mobileInstructions: [
      "Touch and drag to move the paddle left and right",
      "Tap the screen to start the game"
    ],
    tips: [
      "Aim for the corners and edges of bricks",
      "Control the ball's angle with paddle movement",
      "Try to create gaps in the brick wall"
    ]
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Logic puzzle game. Find all hidden mines using numbered clues. Think carefully!',
    icon: '💣',
    difficulty: 'Hard',
    ageCategory: 'teens',
    minAge: 10,
    maxAge: 18,
    storageKey: 'minesweeper-stats',
    instructions: [
      "Click cells to reveal what's underneath",
      "Numbers show how many mines are adjacent",
      "Right-click to flag suspected mines",
      "Find all mines without clicking on any",
      "Use logic and deduction to solve safely"
    ],
    tips: [
      "Start with cells that have fewer adjacent possibilities",
      "Use flags to mark known mines",
      "Count carefully around numbered cells"
    ]
  },
  {
    id: 'game-2048',
    title: '2048',
    description: 'Number puzzle game. Combine tiles to reach 2048! Addictive and challenging.',
    icon: '🔢',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 10,
    maxAge: 18,
    storageKey: 'game-2048-best',
    instructions: [
      "Move tiles to combine matching numbers",
      "When two tiles with the same number touch, they merge",
      "Try to create a tile with the number 2048"
    ],
    pcInstructions: [
      "Use arrow keys (↑↓←→) to move all tiles in that direction",
      "Press and hold keys for continuous movement"
    ],
    mobileInstructions: [
      "Swipe in any direction to move all tiles",
      "Swipe up, down, left, or right to slide tiles"
    ],
    tips: [
      "Keep your highest tile in one corner",
      "Build up numbers in one direction",
      "Don't randomly swipe - plan your moves"
    ]
  },

  // Additional Adult Games
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'Classic strategy game with advanced AI. Best of 5 rounds. Can you outsmart the computer?',
    icon: '✂️',
    difficulty: 'Easy',
    ageCategory: 'adults',
    minAge: 6,
    maxAge: 99,
    storageKey: 'rps-tournament-record',
    instructions: [
      "Choose Rock, Paper, or Scissors",
      "Rock beats Scissors, Scissors beat Paper, Paper beats Rock",
      "Play best of 5 rounds against the AI",
      "Try to predict and counter the AI's patterns",
      "Win the tournament by winning 3 rounds first"
    ],
    tips: [
      "Look for patterns in the AI's choices",
      "Mix up your strategy to stay unpredictable",
      "Remember: most people favor Rock first"
    ]
  },
  {
    id: 'typing-test',
    title: 'Typing Speed Test',
    description: 'Improve your typing speed and accuracy. Track WPM and compete with yourself!',
    icon: '⌨️',
    difficulty: 'Medium',
    ageCategory: 'adults',
    minAge: 12,
    maxAge: 99,
    storageKey: 'typing-test-records',
    instructions: [
      "Type the words shown on screen as accurately as possible",
      "Don't worry about mistakes - focus on accuracy first",
      "Speed will come naturally with practice",
      "Test duration is 1 minute",
      "Your WPM and accuracy percentage are calculated"
    ],
    tips: [
      "Use proper finger placement on home keys",
      "Look at the screen, not your keyboard",
      "Maintain steady rhythm rather than bursts of speed"
    ]
  },
  {
    id: 'math-quiz',
    title: 'Mental Math Quiz',
    description: 'Quick math challenges to keep your brain sharp. Addition, subtraction, and multiplication!',
    icon: '🧠',
    difficulty: 'Medium',
    ageCategory: 'adults',
    minAge: 10,
    maxAge: 99,
    storageKey: 'math-quiz-scores',
    instructions: [
      "Solve math problems as quickly as possible",
      "Type your answer and press Enter",
      "You have 60 seconds to solve as many as you can",
      "Problems get slightly harder as you progress",
      "Accuracy bonus: consecutive correct answers give extra points"
    ],
    tips: [
      "Use mental math shortcuts when possible",
      "Don't spend too long on one problem",
      "Practice basic multiplication tables"
    ]
  },
  {
    id: 'speed-clicker',
    title: 'Speed Clicker',
    description: 'Click as fast as you can in 10 seconds! Test your clicking speed and reflexes.',
    icon: '⚡',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 5,
    maxAge: 99,
    storageKey: 'speed-clicker-records',
    instructions: [
      "Click the big button to start the 10-second timer",
      "Click as fast as you can within the time limit",
      "Try to achieve the highest clicks per second (CPS)",
      "The button grows bigger as you click more",
      "Beat your personal best score!"
    ],
    tips: [
      "Use multiple fingers for faster clicking",
      "Keep a steady rhythm rather than random clicking",
      "Stay focused for the entire 10 seconds"
    ]
  },
  {
    id: 'reaction-timer',
    title: 'Reaction Timer',
    description: 'Test your reflexes! Click as fast as you can when the screen turns green.',
    icon: '🎯',
    difficulty: 'Easy',
    ageCategory: 'teens',
    minAge: 6,
    maxAge: 99,
    storageKey: 'reaction-timer-best',
    instructions: [
      "Click the game area to start",
      "Wait for the screen to turn GREEN",
      "Click as fast as you can when it turns green",
      "Don't click too early or you'll have to restart",
      "Try to achieve the fastest reaction time possible"
    ],
    tips: [
      "Stay relaxed and focused",
      "Don't anticipate - wait for the green signal",
      "Practice improves reaction time over time"
    ]
  },
  
  // Advanced Games for All Ages
  {
    id: 'tetris',
    title: 'Block Puzzle',
    description: 'Classic falling blocks puzzle! Arrange blocks to clear lines in this timeless game.',
    icon: '🧩',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 9,
    maxAge: 99,
    storageKey: 'tetris-best',
    instructions: [
      "Use arrow keys (PC) or swipe (mobile) to move blocks",
      "Rotate blocks with up arrow or tap rotate button",
      "Fill complete horizontal lines to clear them",
      "Game ends when blocks reach the top"
    ],
    pcInstructions: [
      "Arrow keys: Move left/right/down",
      "Up arrow: Rotate piece",
      "Space: Hard drop",
      "P: Pause game"
    ],
    mobileInstructions: [
      "Swipe left/right: Move blocks",
      "Tap rotate button: Turn blocks",
      "Swipe down: Soft drop",
      "Tap pause button to pause"
    ],
    tips: [
      "Clear multiple lines at once for more points",
      "Keep the stack low and even",
      "Plan ahead - preview shows next piece"
    ]
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Strategic dropping game! Get four in a row before your opponent. Play vs AI or human!',
    icon: '🔴',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 99,
    storageKey: 'connect-four-wins',
    instructions: [
      "Choose to play against AI or another human",
      "Click on a column to drop your piece",
      "Get 4 pieces in a row to win",
      "Can be horizontal, vertical, or diagonal",
      "Block your opponent while building your own line"
    ],
    tips: [
      "Control the center columns",
      "Think multiple moves ahead",
      "Watch for opponent's winning moves",
      "AI is smart - plan your strategy!"
    ]
  },
  {
    id: 'match-three',
    title: 'Gem Crusher',
    description: 'Match colorful gems! Swap adjacent gems to create matches of three or more.',
    icon: '💎',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 6,
    maxAge: 99,
    storageKey: 'match-three-score',
    instructions: [
      "Click two adjacent gems to swap them",
      "Match 3 or more gems of the same color",
      "Matched gems disappear and new ones fall down",
      "Create combos for bonus points"
    ],
    tips: [
      "Look for matches that create cascades",
      "Focus on bottom matches to trigger chain reactions",
      "Special gems have powerful effects"
    ]
  },
  {
    id: 'flappy-bird',
    title: 'Flying Challenge',
    description: 'Navigate through obstacles! Tap to fly and avoid hitting pipes in this skill game.',
    icon: '🐦',
    difficulty: 'Hard',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 99,
    storageKey: 'flappy-bird-best',
    instructions: [
      "Tap space (PC) or screen (mobile) to fly up",
      "Navigate through the gaps between pipes",
      "Don't hit pipes or the ground",
      "Score points by passing through gaps"
    ],
    pcInstructions: [
      "Space bar: Flap wings",
      "Enter: Start game",
      "R: Restart after game over"
    ],
    mobileInstructions: [
      "Tap screen: Flap wings",
      "Tap play button: Start game",
      "Tap restart: Play again"
    ],
    tips: [
      "Tap gently for small hops",
      "Time your taps - don't spam",
      "Stay calm and focused"
    ]
  },
  {
    id: 'color-swipe',
    title: 'Color Swipe',
    description: 'Swipe left or right based on the color! Fast-paced mobile-friendly game.',
    icon: '⬅️',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 5,
    maxAge: 12,
    storageKey: 'color-swipe-best',
    instructions: [
      "Look at the color and direction shown",
      "Swipe in the correct direction for that color",
      "Mobile: Swipe on the card",
      "Desktop: Click the buttons",
      "Score points for correct swipes"
    ],
    tips: [
      "React quickly but accurately",
      "Perfect for touch screens!",
      "Great for hand-eye coordination"
    ]
  },
  {
    id: 'tap-sequence',
    title: 'Tap Sequence',
    description: 'Remember and tap the sequence! Memory game with colorful tiles.',
    icon: '🎯',
    difficulty: 'Medium',
    ageCategory: 'kids',
    minAge: 6,
    maxAge: 14,
    storageKey: 'tap-sequence-best',
    instructions: [
      "Watch the tiles light up in sequence",
      "Tap the tiles in the exact same order",
      "Each level adds one more tile",
      "One mistake ends the game"
    ],
    tips: [
      "Focus on the pattern, not individual tiles",
      "Use rhythm to help remember",
      "Great for improving memory!"
    ]
  },
  {
    id: 'quick-math',
    title: 'Quick Math',
    description: 'Fast mental math challenges! Choose the correct answer quickly.',
    icon: '🧮',
    difficulty: 'Medium',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 99,
    storageKey: 'quick-math-best',
    instructions: [
      "Solve the math problem shown",
      "Choose the correct answer from 4 options",
      "Score points for each correct answer",
      "You have 60 seconds!"
    ],
    tips: [
      "Perfect for improving mental math",
      "Works great on mobile",
      "Challenge your friends!"
    ]
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    description: 'Memorize and recreate patterns! Visual memory training game.',
    icon: '🎨',
    difficulty: 'Hard',
    ageCategory: 'teens',
    minAge: 9,
    maxAge: 99,
    storageKey: 'pattern-match-best',
    instructions: [
      "Watch the pattern of colored circles",
      "Recreate it by tapping the circles",
      "Each level shows a longer pattern",
      "One mistake ends the game"
    ],
    tips: [
      "Use visual memory techniques",
      "Group patterns into chunks",
      "Excellent for brain training!"
    ]
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form words! Educational word puzzle game.',
    icon: '🔤',
    difficulty: 'Medium',
    ageCategory: 'kids',
    minAge: 7,
    maxAge: 14,
    storageKey: 'word-scramble-best',
    instructions: [
      "Look at the scrambled letters",
      "Type the correct word",
      "Use hints if you're stuck (-5 points)",
      "Skip to get a new word"
    ],
    tips: [
      "Look for common letter patterns",
      "Think of word categories",
      "Perfect for vocabulary building!"
    ]
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    description: 'Pop rising bubbles before they float away! Fast-paced action game.',
    icon: '🫧',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 4,
    maxAge: 99,
    storageKey: 'bubble-pop-best',
    instructions: [
      "Click or tap bubbles to pop them",
      "Bigger bubbles give more points",
      "Don't let bubbles escape",
      "You have 30 seconds!"
    ],
    tips: [
      "Focus on big bubbles first",
      "Develop a popping rhythm",
      "Great for hand-eye coordination!"
    ]
  },
  {
    id: 'stack-tower',
    title: 'Stack Tower',
    description: 'Stack moving blocks perfectly! Precision and timing challenge.',
    icon: '🏗️',
    difficulty: 'Hard',
    ageCategory: 'teens',
    minAge: 8,
    maxAge: 99,
    storageKey: 'stack-tower-best',
    instructions: [
      "Click to drop the moving block",
      "Stack blocks on top of each other",
      "Misaligned blocks get cut off",
      "Build the tallest tower possible!"
    ],
    tips: [
      "Time your clicks perfectly",
      "The tower gets harder as it grows",
      "Precision is key!"
    ]
  },
  {
    id: 'card-memory',
    title: 'Card Memory',
    description: 'Classic memory card matching game! Find all pairs quickly.',
    icon: '🃏',
    difficulty: 'Medium',
    ageCategory: 'kids',
    minAge: 5,
    maxAge: 99,
    storageKey: 'card-memory-best',
    instructions: [
      "Click cards to flip them over",
      "Find matching emoji pairs",
      "Remember card positions",
      "Match all pairs to win!"
    ],
    tips: [
      "Focus on one area at a time",
      "Create a mental map",
      "Fewer moves = better score!"
    ]
  },
  {
    id: 'drum-kit',
    title: 'Virtual Drum Kit',
    description: 'Play drums with your keyboard or touch! Create beats and rhythms.',
    icon: '🥁',
    difficulty: 'Easy',
    ageCategory: 'kids',
    minAge: 5,
    maxAge: 99,
    storageKey: 'drum-kit-patterns',
    instructions: [
      "Click drum pads or use keyboard keys",
      "Each pad plays a different sound",
      "Record patterns to create beats",
      "Keys: Q-W-E, A-S-D, Z-X-C"
    ],
    tips: [
      "Try creating simple rhythms first",
      "Use recording to save cool patterns",
      "Great for musical creativity!"
    ]
  }
];

export const AGE_CATEGORIES = {
  kids: {
    title: "Kids Zone",
    subtitle: "Ages 3-8",
    description: "Fun and educational games perfect for young children",
    icon: "🧸",
    color: "text-yellow-500"
  },
  teens: {
    title: "Teen Challenge", 
    subtitle: "Ages 9-15",
    description: "Exciting games that challenge your skills and reflexes",
    icon: "⚡",
    color: "text-blue-500"
  },
  adults: {
    title: "Master Level",
    subtitle: "Ages 16+", 
    description: "Strategic and competitive games for serious players",
    icon: "🏆",
    color: "text-purple-500"
  }
};