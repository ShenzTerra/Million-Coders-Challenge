
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CommandType, Direction, Position, Command, Level } from './types';
import { LEVELS } from './constants';
import GameStage from './components/GameStage';
import CommandPalette from './components/CommandPalette';
import ProgramQueue from './components/ProgramQueue';

const App: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  const [botPos, setBotPos] = useState<Position>(currentLevel.startPos);
  const [botDir, setBotDir] = useState<Direction>(currentLevel.startDir);
  const [program, setProgram] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'WON' | 'LOST' | 'RUNNING'>('IDLE');
  const [visitedPoints, setVisitedPoints] = useState<Position[]>([]);

  const abortController = useRef<boolean>(false);

  const resetStage = useCallback(() => {
    setBotPos(currentLevel.startPos);
    setBotDir(currentLevel.startDir);
    setIsRunning(false);
    setCurrentStepIndex(null);
    setGameState('IDLE');
    setVisitedPoints([]);
    abortController.current = false;
  }, [currentLevel]);

  useEffect(() => {
    resetStage();
    setProgram([]);
  }, [currentLevelIdx, resetStage]);

  const addCommand = (type: CommandType, x?: number, y?: number) => {
    if (gameState === 'RUNNING') return;
    const newCmd: Command = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x,
      y
    };
    setProgram(prev => [...prev, newCmd]);
    setGameState('IDLE');
    setBotPos(currentLevel.startPos);
    setBotDir(currentLevel.startDir);
  };

  const removeCommand = (idx: number) => {
    if (isRunning) return;
    setProgram(prev => prev.filter((_, i) => i !== idx));
    setGameState('IDLE');
    setBotPos(currentLevel.startPos);
    setBotDir(currentLevel.startDir);
  };

  const clearProgram = () => {
    if (isRunning) return;
    setProgram([]);
    resetStage();
  };

  const runProgram = async () => {
    if (program.length === 0 || isRunning) return;
    setIsRunning(true);
    setGameState('RUNNING');
    setVisitedPoints([]);

    let tempPos = { ...currentLevel.startPos };
    let tempDir = currentLevel.startDir;
    let localVisited: Position[] = [];

    const recordVisit = (pos: Position) => {
      if (!localVisited.some(p => p.x === pos.x && p.y === pos.y)) {
        localVisited.push({ ...pos });
        setVisitedPoints([...localVisited]);
      }
    };

    recordVisit(tempPos);

    for (let i = 0; i < program.length; i++) {
      if (abortController.current) break;
      setCurrentStepIndex(i);
      const cmd = program[i];
      
      // Go To is instant, Glide takes time
      const delay = cmd.type === CommandType.GO_TO ? 300 : 800;
      await new Promise(resolve => setTimeout(resolve, delay));

      if (cmd.type === CommandType.MOVE) {
        let nextPos = { ...tempPos };
        if (tempDir === 'N') nextPos.y -= 1;
        else if (tempDir === 'S') nextPos.y += 1;
        else if (tempDir === 'E') nextPos.x += 1;
        else if (tempDir === 'W') nextPos.x -= 1;
        
        if (nextPos.x < 0 || nextPos.x >= currentLevel.gridSize || nextPos.y < 0 || nextPos.y >= currentLevel.gridSize) {
          setGameState('LOST');
          setIsRunning(false);
          return;
        }

        if (currentLevel.obstacles.some(o => o.x === nextPos.x && o.y === nextPos.y)) {
          setBotPos(nextPos);
          setGameState('LOST');
          setIsRunning(false);
          return;
        }
        tempPos = nextPos;
        setBotPos(tempPos);
        recordVisit(tempPos);
      } else if (cmd.type === CommandType.TURN_LEFT) {
        const d: Direction[] = ['N', 'W', 'S', 'E'];
        tempDir = d[(d.indexOf(tempDir) + 1) % 4];
        setBotDir(tempDir);
      } else if (cmd.type === CommandType.TURN_RIGHT) {
        const d: Direction[] = ['N', 'E', 'S', 'W'];
        tempDir = d[(d.indexOf(tempDir) + 1) % 4];
        setBotDir(tempDir);
      } else if (cmd.type === CommandType.GO_TO || cmd.type === CommandType.GLIDE) {
        if (cmd.x !== undefined && cmd.y !== undefined) {
          tempPos = { x: cmd.x, y: cmd.y };
          setBotPos(tempPos);
          recordVisit(tempPos);
        }
      }
    }

    if (!abortController.current) {
      if (currentLevel.isSpecialTask) {
        // Task: Corners (0,0), (max,0), (max,max), (0,max) and Center (2,2)
        const max = currentLevel.gridSize - 1;
        const required = [
          { x: 0, y: 0 }, { x: max, y: 0 }, { x: max, y: max }, { x: 0, y: max }, { x: 2, y: 2 }
        ];
        const allVisited = required.every(req => localVisited.some(v => v.x === req.x && v.y === req.y));
        if (allVisited) {
          setGameState('WON');
        } else {
          setGameState('LOST');
        }
      } else if (tempPos.x === currentLevel.goalPos.x && tempPos.y === currentLevel.goalPos.y) {
        setGameState('WON');
      } else {
        setGameState('LOST');
      }
    }
    
    setIsRunning(false);
    setCurrentStepIndex(null);
  };

  const stopProgram = () => {
    abortController.current = true;
    resetStage();
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden p-1">
                    <img src="/Million Coders Logo.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => {
                      (e.target as any).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNOSAxMGgydjIiLz48cGF0aCBkPSJNMTUgMTBoMnYyIi8+PHBhdGggZD0iTTkgMTV2Mmg2di0yIi8+PC9zdmc+';
                    }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-none">
                        Million Coders
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Module 1</span>
                      <p className="text-slate-400 text-sm">Level {currentLevel.id}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl">
                {LEVELS.map((l, i) => (
                  <button 
                    key={l.id}
                    onClick={() => setCurrentLevelIdx(i)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${currentLevelIdx === i ? 'bg-indigo-500 text-white font-bold shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}
                  >
                    {l.id}
                  </button>
                ))}
            </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Game Board Area */}
            <div className="w-full lg:w-7/12 flex flex-col gap-4">
                <div className="bg-slate-800 p-4 rounded-3xl shadow-2xl border border-slate-700 relative overflow-hidden">
                    
                    {/* Coordinate Helper Overlay */}
                    <div className="mb-4 flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px] px-4 py-3 bg-slate-900/50 rounded-xl border border-indigo-500/30">
                        <h4 className="text-indigo-400 text-[10px] font-bold uppercase mb-1">What is X? ⬅️➡️</h4>
                        <p className="text-slate-400 text-xs">X is for **left/right**. Larger X moves right!</p>
                      </div>
                      <div className="flex-1 min-w-[200px] px-4 py-3 bg-slate-900/50 rounded-xl border border-purple-500/30">
                        <h4 className="text-purple-400 text-[10px] font-bold uppercase mb-1">What is Y? ⬆️⬇️</h4>
                        <p className="text-slate-400 text-xs">Y is for **up/down**. Larger Y moves down!</p>
                      </div>
                    </div>

                    <div className="mb-4 px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                        <p className="text-slate-300 text-sm md:text-base font-medium">{currentLevel.message}</p>
                    </div>

                    <div className="relative">
                      <GameStage 
                        gridSize={currentLevel.gridSize}
                        botPos={botPos} 
                        botDir={botDir} 
                        goalPos={currentLevel.goalPos} 
                        obstacles={currentLevel.obstacles} 
                        gameState={gameState}
                      />
                      
                      {/* Task Checklist for Level 5 */}
                      {currentLevel.isSpecialTask && (
                        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1">
                          {[
                            { label: 'Top-Left (0,0)', check: { x: 0, y: 0 } },
                            { label: 'Top-Right (4,0)', check: { x: 4, y: 0 } },
                            { label: 'Bottom-Right (4,4)', check: { x: 4, y: 4 } },
                            { label: 'Bottom-Left (0,4)', check: { x: 0, y: 4 } },
                            { label: 'Center (2,2)', check: { x: 2, y: 2 } }
                          ].map((req, idx) => (
                            <div key={idx} className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded-md border border-slate-700 flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${visitedPoints.some(v => v.x === req.check.x && v.y === req.check.y) ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                              <span className="text-[10px] font-bold text-slate-300">{req.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Overlays */}
                      {gameState === 'LOST' && (
                        <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center z-40 animate-in fade-in duration-300">
                            <div className="bg-slate-900 p-6 rounded-2xl border-2 border-red-500 shadow-2xl text-center transform animate-bounce">
                                <span className="text-4xl block mb-2">💥</span>
                                <h3 className="text-xl font-bold text-red-400">Not quite!</h3>
                                <p className="text-slate-400 text-xs mt-1">Try a different sequence.</p>
                                <button onClick={resetStage} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors">
                                    Try Again
                                </button>
                            </div>
                        </div>
                      )}

                      {gameState === 'WON' && (
                        <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-[1px] flex items-center justify-center z-40 animate-in fade-in duration-500">
                            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl text-center transform scale-110">
                                <svg className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                <h3 className="text-2xl font-bold text-emerald-400 mb-2">Great Work!</h3>
                                <p className="text-slate-400 mb-6">Master coder in the making!</p>
                                <button onClick={nextLevel} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto transition-all hover:scale-105">
                                    Next Level ➔
                                </button>
                            </div>
                        </div>
                      )}
                    </div>
                </div>
            </div>

            {/* Coding Interface */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
                <CommandPalette 
                  available={currentLevel.availableCommands} 
                  onAdd={addCommand} 
                  disabled={isRunning} 
                  gridSize={currentLevel.gridSize}
                />
                <ProgramQueue 
                  program={program} 
                  onRemove={removeCommand} 
                  onClear={clearProgram} 
                  onRun={runProgram} 
                  onStop={stopProgram}
                  onReset={resetStage}
                  isRunning={isRunning} 
                  currentStepIndex={currentStepIndex} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;
