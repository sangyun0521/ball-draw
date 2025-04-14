import React, { useState, useEffect } from 'react';
import { Settings, Shuffle, Lock, Crown, ArrowRight } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import DrawingPhase from './components/DrawingPhase';

interface Outcome {
  text: string;
  count: number;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConfigLocked, setIsConfigLocked] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
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

  const startGame = () => {
    setShowIntro(false);
    setIsAdmin(true);
  };

  const AdSidePanel = () => (
    <div className="w-64 p-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot="YOUR_AD_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-700">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex justify-center items-center mb-8">
              <h1 className="text-5xl font-bold text-white flex items-center gap-3">
                <Crown className="h-10 w-10" />
                사기 제비뽑기
              </h1>
            </div>

            {/* Introduction Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-white">
              <h2 className="text-3xl font-bold mb-4 text-center">
                정말 운에 맡기시겠어요?
              </h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-xl">"사기 제비뽑기"</strong>는
                    겉보기엔 평범한 제비뽑기처럼 보이지만,
                    <br />
                    사실은 이미 결과가 짜여 있는 특별한 제비뽑기 입니다.
                  </p>
                </div>

                <div className="h-px bg-white/20 my-6"></div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span>🧠</span> 사용법
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          몇 개의 공을 사용할지 설정합니다. (예: 5개 → 1번~5번
                          공)
                        </li>
                        <li>
                          원하는 결과들을 입력합니다. (예: 당첨, 커피 사오기 등)
                        </li>
                        <li>
                          각각의 공 번호에 결과를 몰래 지정합니다. (예: 2번 공 →
                          당첨)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/20 my-6"></div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span>😎</span> 이런 순간에 써보세요!
                  </h3>
                  <ul className="list-none space-y-2 ml-4">
                    <li>• 점심 메뉴 고를 때: 🍗 "닭갈비 당첨~"</li>
                    <li>• 벌칙 정할 때: 💦 "설거지는 누구~?"</li>
                    <li>• 팀 발표 순서 정할 때: 🎤 "누가 먼저 발표할래?"</li>
                  </ul>
                </div>

                <div className="bg-white/10 rounded-xl p-6 mt-6">
                  <p className="text-lg leading-relaxed">
                    하지만 남용은 금물! 친구 잃을 수도 있어요. 🤫
                  </p>
                </div>

                <button
                  onClick={startGame}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl mt-8"
                >
                  <Shuffle className="h-5 w-5" />
                  게임 시작하기
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-purple-700">
      <div className="flex justify-between">
        {/* Left Ad Panel */}
        <AdSidePanel />

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

        {/* Right Ad Panel */}
        <AdSidePanel />
      </div>
    </div>
  );
}

export default App;
