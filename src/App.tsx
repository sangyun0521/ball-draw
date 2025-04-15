import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Settings, Shuffle, Lock, Crown, ArrowRight } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import DrawingPhase from './components/DrawingPhase';
import Intro from './components/Intro';

interface Outcome {
  text: string;
  count: number;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConfigLocked, setIsConfigLocked] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    ballCount: 5,
    outcomes: [
      { text: '당첨 (WIN)', count: 1 },
      { text: '꽝 (MISS)', count: 3 },
      { text: '벌칙 (PENALTY)', count: 1 },
    ] as Outcome[],
    assignments: {} as Record<number, string>,
  });

  useEffect(() => {
    // AdSense 스크립트 동적 로드
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
    if (isConfigLocked) {
      setIsConfigLocked(false);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Intro Page */}
        <Route
          path="/"
          element={<Intro onStartGame={() => (window.location.href = '/game')} />}
        />

        {/* Game Page */}
        <Route
          path="/game"
          element={
            <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-700">
              <div className="flex justify-between">
                {/* Main Content */}
                <div className="flex-1 container mx-auto px-4 py-8">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                      <Crown className="h-8 w-8" />
                      제비뽑기
                    </h1>
                    <button
                      onClick={toggleAdmin}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Settings className="h-6 w-6 text-white" />
                    </button>
                  </div>

                  {/* Main Content */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                    {isAdmin && !isConfigLocked ? (
                      <AdminPanel
                        gameConfig={gameConfig}
                        setGameConfig={setGameConfig}
                        onLock={() => setIsConfigLocked(true)}
                      />
                    ) : (
                      <DrawingPhase gameConfig={gameConfig} isAdmin={isAdmin} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
