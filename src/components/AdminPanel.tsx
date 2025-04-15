import React, { useState } from 'react';
import { Plus, Minus, Lock, Trash2, ChevronDown } from 'lucide-react';

interface Outcome {
  text: string;
  count: number;
}

interface AdminPanelProps {
  gameConfig: {
    ballCount: number;
    outcomes: Outcome[];
    assignments: Record<number, string>;
  };
  setGameConfig: (config: any) => void;
  onLock: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  gameConfig,
  setGameConfig,
  onLock,
}) => {
  const [showAssignments, setShowAssignments] = useState(false);

  const handleBallCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(20, gameConfig.ballCount + delta));
    setGameConfig({ ...gameConfig, ballCount: newCount });
  };

  const handleOutcomeTextChange = (index: number, text: string) => {
    const newOutcomes = [...gameConfig.outcomes];
    newOutcomes[index] = { ...newOutcomes[index], text };
    setGameConfig({ ...gameConfig, outcomes: newOutcomes });
  };

  const handleOutcomeCountChange = (index: number, delta: number) => {
    const newOutcomes = [...gameConfig.outcomes];
    const currentTotal = getTotalOutcomes();
    const maxAllowed = gameConfig.ballCount - (currentTotal - newOutcomes[index].count);
    
    const newCount = Math.max(0, Math.min(maxAllowed, newOutcomes[index].count + delta));
    newOutcomes[index] = { ...newOutcomes[index], count: newCount };
    setGameConfig({ ...gameConfig, outcomes: newOutcomes });
  };

  const addNewOutcome = () => {
    const currentTotal = getTotalOutcomes();
    if (currentTotal < gameConfig.ballCount) {
      setGameConfig({
        ...gameConfig,
        outcomes: [...gameConfig.outcomes, { text: '', count: 0 }]
      });
    }
  };

  const removeOutcome = (index: number) => {
    const newOutcomes = gameConfig.outcomes.filter((_, i) => i !== index);
    // Clear assignments for the removed outcome
    const newAssignments = { ...gameConfig.assignments };
    const removedOutcomeText = gameConfig.outcomes[index].text;
    Object.entries(newAssignments).forEach(([key, value]) => {
      if (value === removedOutcomeText) {
        delete newAssignments[key];
      }
    });
    
    setGameConfig({
      ...gameConfig,
      outcomes: newOutcomes,
      assignments: newAssignments
    });
  };

  const getTotalOutcomes = () => {
    return gameConfig.outcomes.reduce((sum, outcome) => sum + outcome.count, 0);
  };

  const getAssignedCount = (outcomeText: string) => {
    return Object.values(gameConfig.assignments).filter(text => text === outcomeText).length;
  };

  const handleAssignmentChange = (ballNumber: number, outcomeText: string) => {
    const currentOutcome = gameConfig.assignments[ballNumber];
    const targetOutcome = gameConfig.outcomes.find(o => o.text === outcomeText);
    
    if (!targetOutcome) return;

    // Check if we're not exceeding the outcome's count limit
    if (outcomeText !== currentOutcome && getAssignedCount(outcomeText) >= targetOutcome.count) {
      return;
    }

    setGameConfig({
      ...gameConfig,
      assignments: {
        ...gameConfig.assignments,
        [ballNumber]: outcomeText
      }
    });
  };

  const autoAssignOutcomes = () => {
    const assignments: Record<number, string> = {};
    let currentBall = 1;
    
    gameConfig.outcomes.forEach(outcome => {
      for (let i = 0; i < outcome.count; i++) {
        assignments[currentBall] = outcome.text;
        currentBall++;
      }
    });

    setGameConfig({
      ...gameConfig,
      assignments
    });
  };

  const isAssignmentComplete = () => {
    const assignedCount = Object.keys(gameConfig.assignments).length;
    return assignedCount === gameConfig.ballCount && 
           gameConfig.outcomes.every(outcome => 
             getAssignedCount(outcome.text) === outcome.count
           );
  };

  const totalOutcomes = getTotalOutcomes();
  const remainingBalls = gameConfig.ballCount - totalOutcomes;
  const hasValidOutcomes = gameConfig.outcomes.length > 0 && gameConfig.outcomes.some(o => o.count > 0);

  return (
    <div className="space-y-8 px-2 md:px-4 lg:px-6 max-w-screen overflow-hidden mx-auto"> {/* Adjust padding and center */}
      <div className="bg-white/20 rounded-xl p-4 md:p-6 space-y-6 overflow-x-auto"> {/* Adjust padding */}
        <h2 className="text-2xl font-bold text-white mb-4">설정 단계 (Setup Phase)</h2>
        
        {/* Ball Count Control */}
        <div className="space-y-2">
          <label className="text-white text-lg">볼 개수 (Number of Balls)</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBallCountChange(-1)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="text-2xl font-bold text-white">{gameConfig.ballCount}</span>
            <button
              onClick={() => handleBallCountChange(1)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-white text-lg">결과 목록 (Outcomes)</label>
            <span className="text-white text-sm">
              남은 볼: {remainingBalls} / {gameConfig.ballCount}
            </span>
          </div>
          
          <div className="space-y-3">
            {gameConfig.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={outcome.text}
                  onChange={(e) => handleOutcomeTextChange(index, e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/20"
                  placeholder={`Outcome ${index + 1}`}
                />
                <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                  <button
                    onClick={() => handleOutcomeCountChange(index, -1)}
                    className="p-1 rounded-lg hover:bg-white/20 text-white transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-white w-8 text-center">{outcome.count}</span>
                  <button
                    onClick={() => handleOutcomeCountChange(index, 1)}
                    className="p-1 rounded-lg hover:bg-white/20 text-white transition"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeOutcome(index)}
                  className="p-2 rounded-lg hover:bg-white/20 text-white transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addNewOutcome}
            disabled={totalOutcomes >= gameConfig.ballCount}
            className="w-full p-3 rounded-lg bg-white/20 hover:bg-white/30 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add New Outcome
          </button>
        </div>

        {/* Ball Assignments */}
        {hasValidOutcomes && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              className="w-full p-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-bold flex items-center justify-between transition"
            >
              <span>볼 번호별 결과 지정 (Ball Assignments)</span>
              <ChevronDown className={`h-5 w-5 transform transition-transform ${showAssignments ? 'rotate-180' : ''}`} />
            </button>
            
            {showAssignments && (
              <div className="overflow-x-auto"> {/* Add horizontal scroll */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {Array.from({ length: gameConfig.ballCount }, (_, i) => i + 1).map((ballNumber) => (
                    <div key={ballNumber} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                          {ballNumber}
                        </div>
                        <select
                          value={gameConfig.assignments[ballNumber] || ''}
                          onChange={(e) => handleAssignmentChange(ballNumber, e.target.value)}
                          className="flex-1 p-2 rounded-lg bg-white/20 text-white border border-white/20"
                        >
                          <option value="">Select outcome</option>
                          {gameConfig.outcomes.map((outcome, index) => {
                            const assignedCount = getAssignedCount(outcome.text);
                            const isCurrentSelection = gameConfig.assignments[ballNumber] === outcome.text;
                            const isDisabled = assignedCount >= outcome.count && !isCurrentSelection;
                            
                            return (
                              <option 
                                key={index} 
                                value={outcome.text}
                                disabled={isDisabled}
                              >
                                {outcome.text} ({assignedCount}/{outcome.count})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={autoAssignOutcomes}
              className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
            >
              자동 배정 (Auto-assign Outcomes)
            </button>
          </div>
        )}
      </div>

      {/* Lock Button */}
      <button
        onClick={onLock}
        disabled={!isAssignmentComplete()}
        className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Lock className="h-5 w-5" />
        Lock and Start Draw
      </button>
    </div>
  );
}

export default AdminPanel;