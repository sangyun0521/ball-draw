import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, RotateCcw } from 'lucide-react';

interface Outcome {
  text: string;
  count: number;
}

interface DrawingPhaseProps {
  gameConfig: {
    ballCount: number;
    outcomes: Outcome[];
    assignments: Record<number, string>;
  };
  isAdmin: boolean;
}

const DrawingPhase: React.FC<DrawingPhaseProps> = ({ gameConfig, isAdmin }) => {
  const [balls, setBalls] = useState<number[]>([]);
  const [drawnBalls, setDrawnBalls] = useState<Set<number>>(new Set());
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    shuffleBalls();
  }, [gameConfig.ballCount]);

  const shuffleBalls = () => {
    const newBalls = Array.from(
      { length: gameConfig.ballCount },
      (_, i) => i + 1
    ).sort(() => Math.random() - 0.5);
    setBalls(newBalls);
    setDrawnBalls(new Set());
  };

  const handleBallClick = async (ball: number) => {
    if (drawnBalls.has(ball) || isFlipping) return;
    
    setSelectedBall(ball);
    setIsFlipping(true);
    
    // Wait for flip animation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setDrawnBalls(prev => new Set([...prev, ball]));
    setIsFlipping(false);
  };

  const getRandomPosition = (index: number) => {
    const angle = (index / gameConfig.ballCount) * Math.PI * 2;
    const containerWidth = window.innerWidth; // 화면 너비
    const containerHeight = window.innerHeight; // 화면 높이
    const radius = Math.min(containerWidth, containerHeight) / 3 - 50; // 반지름 계산 (화면 크기에 비례)
  
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const resetGame = () => {
    setSelectedBall(null);
    setDrawnBalls(new Set());
    shuffleBalls();
  };

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen max-w-screen mx-auto px-2 md:px-4 lg:px-6">
      {/* Drawing Area */}
      <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {balls.map((ball, index) => {
            const pos = getRandomPosition(index);
            const isDrawn = drawnBalls.has(ball);
            const isSelected = selectedBall === ball;
            
            return (
              <motion.button
                key={ball}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  x: pos.x,
                  y: pos.y,
                  rotateY: (isSelected && isFlipping) ? 180 : 0,
                  transition: { 
                    type: "spring",
                    stiffness: 100,
                    duration: 0.6
                  }
                }}
                whileHover={{ scale: isDrawn ? 1 : 1.1 }}
                onClick={() => handleBallClick(ball)}
                className={`absolute w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold cursor-pointer transform hover:shadow-xl transition-shadow ${
                  isDrawn 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white cursor-default'
                    : 'bg-gradient-to-br from-yellow-300 to-yellow-500 cursor-pointer'
                }`}
                style={{
                  transformOrigin: "center center",
                  perspective: "1000px"
                }}
              >
                {isDrawn ? (
                  <div className="transform rotate-y-180">
                    {gameConfig.assignments[ball]}
                  </div>
                ) : (
                  ball
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Game Controls */}
      <div className="mt-8 flex gap-4">
        {drawnBalls.size > 0 && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Reset Game
          </button>
        )}
        <div className="px-6 py-3 bg-white/10 rounded-lg text-white">
          Remaining: {gameConfig.ballCount - drawnBalls.size} / {gameConfig.ballCount}
        </div>
      </div>
    </div>
  );
}

export default DrawingPhase;