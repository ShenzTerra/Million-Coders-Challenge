
import React from 'react';
import { Position, Direction } from '../types';

interface GameStageProps {
  gridSize: number;
  botPos: Position;
  botDir: Direction;
  goalPos: Position;
  obstacles: Position[];
  gameState: 'IDLE' | 'WON' | 'LOST' | 'RUNNING';
}

const GameStage: React.FC<GameStageProps> = ({ gridSize, botPos, botDir, goalPos, obstacles, gameState }) => {
  const cellPercent = 100 / gridSize;

  const getRotation = (dir: Direction) => {
    switch (dir) {
      case 'N': return '0deg';
      case 'E': return '90deg';
      case 'S': return '180deg';
      case 'W': return '270deg';
    }
  };

  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      cells.push(
        <div key={`${x}-${y}`} className="border border-slate-800/50"></div>
      );
    }
  }

  return (
    <div className="aspect-square w-full relative bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-700">
      {/* Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none grid"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)` 
        }}
      >
        {cells}
      </div>

      {/* Obstacles */}
      {obstacles.map((obs, i) => (
        <div 
          key={i}
          className="absolute bg-slate-700 rounded-lg transform scale-90 shadow-inner flex items-center justify-center border-b-4 border-slate-800"
          style={{ 
            width: `${cellPercent}%`, 
            height: `${cellPercent}%`, 
            left: `${obs.x * cellPercent}%`, 
            top: `${obs.y * cellPercent}%` 
          }}
        >
          <div className="w-2/3 h-2/3 border-2 border-slate-600 rounded opacity-20"></div>
        </div>
      ))}

      {/* Goal */}
      <div 
        className="absolute flex items-center justify-center transition-all duration-500"
        style={{ 
          width: `${cellPercent}%`, 
          height: `${cellPercent}%`, 
          left: `${goalPos.x * cellPercent}%`, 
          top: `${goalPos.y * cellPercent}%` 
        }}
      >
        <div className={`relative ${gameState === 'WON' ? 'animate-bounce' : 'animate-pulse'}`}>
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20"></div>
          <svg className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 fill-yellow-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      {/* Robot */}
      <div 
        className="absolute flex items-center justify-center z-10 robot-transition"
        style={{ 
          width: `${cellPercent}%`, 
          height: `${cellPercent}%`, 
          left: `${botPos.x * cellPercent}%`, 
          top: `${botPos.y * cellPercent}%` 
        }}
      >
        <div 
          className="relative w-3/4 h-3/4 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/40 flex items-center justify-center border-b-4 border-indigo-700 robot-body-transition"
          style={{ transform: `rotate(${getRotation(botDir)})` }}
        >
          {/* Eyes */}
          <div className="flex gap-2 mb-1">
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-inner shadow-white/50 ${gameState === 'LOST' ? 'bg-red-400' : 'bg-cyan-300'}`}></div>
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shadow-inner shadow-white/50 ${gameState === 'LOST' ? 'bg-red-400' : 'bg-cyan-300'}`}></div>
          </div>
          {/* Direction Indicator */}
          <div className="absolute -top-1 w-2 h-2 bg-indigo-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GameStage;
