
import React, { useState } from 'react';
import { CommandType } from '../types';

interface CommandPaletteProps {
  available: CommandType[];
  onAdd: (type: CommandType, x?: number, y?: number) => void;
  disabled?: boolean;
  gridSize: number;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ available, onAdd, disabled, gridSize }) => {
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);

  const adjustX = (val: number) => {
    setTargetX(prev => Math.max(0, Math.min(gridSize - 1, prev + val)));
  };

  const adjustY = (val: number) => {
    setTargetY(prev => Math.max(0, Math.min(gridSize - 1, prev + val)));
  };

  const renderIcon = (type: CommandType) => {
    switch (type) {
      case CommandType.MOVE:
        return <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
      case CommandType.TURN_LEFT:
        return <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
      case CommandType.TURN_RIGHT:
        return <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
      case CommandType.GO_TO:
        return <span className="text-2xl font-bold">📍</span>;
      case CommandType.GLIDE:
        return <span className="text-2xl font-bold">🚀</span>;
    }
  };

  const getColor = (type: CommandType) => {
    switch (type) {
      case CommandType.MOVE: return 'bg-blue-500 border-blue-700';
      case CommandType.TURN_LEFT: return 'bg-purple-500 border-purple-700';
      case CommandType.TURN_RIGHT: return 'bg-purple-500 border-purple-700';
      case CommandType.GO_TO: return 'bg-indigo-600 border-indigo-800';
      case CommandType.GLIDE: return 'bg-orange-500 border-orange-700';
    }
  };

  const getLabel = (type: CommandType) => {
    switch (type) {
      case CommandType.MOVE: return 'Move';
      case CommandType.TURN_LEFT: return 'Turn Left';
      case CommandType.TURN_RIGHT: return 'Turn Right';
      case CommandType.GO_TO: return 'Go To X:Y';
      case CommandType.GLIDE: return 'Glide to X:Y';
    }
  };

  const showCoordinates = available.includes(CommandType.GO_TO) || available.includes(CommandType.GLIDE);

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col gap-6">
      <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Commands Palette</h2>
      
      {showCoordinates && (
        <div className="grid grid-cols-2 gap-4">
          {/* Large X Control */}
          <div className="bg-slate-900 p-4 rounded-2xl border-b-4 border-indigo-700 flex flex-col items-center gap-2 shadow-lg">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">X Position</span>
            <div className="flex items-center justify-between w-full gap-2">
              <button 
                onClick={() => adjustX(-1)}
                className="w-10 h-10 bg-indigo-500 hover:bg-indigo-400 active:scale-90 rounded-lg text-white font-bold text-xl transition-all shadow-md shadow-indigo-500/20"
              >
                -
              </button>
              <span className="text-3xl font-black text-white w-12 text-center font-mono">{targetX}</span>
              <button 
                onClick={() => adjustX(1)}
                className="w-10 h-10 bg-indigo-500 hover:bg-indigo-400 active:scale-90 rounded-lg text-white font-bold text-xl transition-all shadow-md shadow-indigo-500/20"
              >
                +
              </button>
            </div>
            <span className="text-slate-500 text-[9px] font-bold">Left ⬅️ ➡️ Right</span>
          </div>

          {/* Large Y Control */}
          <div className="bg-slate-900 p-4 rounded-2xl border-b-4 border-purple-700 flex flex-col items-center gap-2 shadow-lg">
            <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest">Y Position</span>
            <div className="flex items-center justify-between w-full gap-2">
              <button 
                onClick={() => adjustY(-1)}
                className="w-10 h-10 bg-purple-500 hover:bg-purple-400 active:scale-90 rounded-lg text-white font-bold text-xl transition-all shadow-md shadow-purple-500/20"
              >
                -
              </button>
              <span className="text-3xl font-black text-white w-12 text-center font-mono">{targetY}</span>
              <button 
                onClick={() => adjustY(1)}
                className="w-10 h-10 bg-purple-500 hover:bg-purple-400 active:scale-90 rounded-lg text-white font-bold text-xl transition-all shadow-md shadow-purple-500/20"
              >
                +
              </button>
            </div>
            <span className="text-slate-500 text-[9px] font-bold">Up ⬆️ ⬇️ Down</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {available.map(type => (
          <button
            key={type}
            onClick={() => onAdd(type, targetX, targetY)}
            disabled={disabled}
            className={`
              flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl shadow-lg border-b-4 transition-all
              ${getColor(type)}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0 active:border-b-0'}
              text-white font-bold
            `}
          >
            {renderIcon(type)}
            <span className="text-[10px] md:text-sm">{getLabel(type)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandPalette;
