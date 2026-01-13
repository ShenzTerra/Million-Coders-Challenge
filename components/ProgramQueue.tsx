
import React from 'react';
import { Command, CommandType } from '../types';

interface ProgramQueueProps {
  program: Command[];
  onRemove: (idx: number) => void;
  onClear: () => void;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  isRunning: boolean;
  currentStepIndex: number | null;
}

const ProgramQueue: React.FC<ProgramQueueProps> = ({ 
  program, onRemove, onClear, onRun, onStop, onReset, isRunning, currentStepIndex 
}) => {
  const getIconColor = (type: CommandType) => {
    if (type === CommandType.MOVE) return 'text-blue-400';
    if (type === CommandType.GO_TO) return 'text-indigo-400';
    if (type === CommandType.GLIDE) return 'text-orange-400';
    return 'text-purple-400';
  };

  const getBorderColor = (type: CommandType) => {
    if (type === CommandType.MOVE) return 'border-l-blue-500';
    if (type === CommandType.GO_TO) return 'border-l-indigo-500';
    if (type === CommandType.GLIDE) return 'border-l-orange-500';
    return 'border-l-purple-500';
  };

  const getLabel = (cmd: Command) => {
    switch (cmd.type) {
      case CommandType.MOVE: return 'Move Forward';
      case CommandType.TURN_LEFT: return 'Turn Left';
      case CommandType.TURN_RIGHT: return 'Turn Right';
      case CommandType.GO_TO: return `Go to (${cmd.x}, ${cmd.y})`;
      case CommandType.GLIDE: return `Glide to (${cmd.x}, ${cmd.y})`;
    }
  };

  return (
    <div className="flex-1 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Your Program</h2>
        <button 
          onClick={onClear}
          disabled={isRunning || program.length === 0}
          className="text-red-400 hover:text-red-300 disabled:text-slate-600 text-xs font-bold flex items-center gap-1 transition-colors"
        >
          CLEAR
        </button>
      </div>

      <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border-2 border-dashed border-slate-700 overflow-y-auto max-h-[400px] custom-scrollbar">
        {program.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-2xl">👇</span>
            </div>
            <p className="text-sm font-medium text-center">Click commands to build your logic!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {program.map((cmd, idx) => (
              <div 
                key={cmd.id}
                onClick={() => !isRunning && onRemove(idx)}
                className={`
                  relative p-3 rounded-lg flex items-center gap-4 cursor-pointer group transition-all duration-300 border-l-4 
                  ${getBorderColor(cmd.type)}
                  ${currentStepIndex === idx ? 'bg-yellow-500/20 border-yellow-500 scale-105 z-10 shadow-lg' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}
                `}
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-mono text-slate-500">
                  {idx + 1}
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <span className={`font-bold text-xs md:text-sm text-slate-200 ${getIconColor(cmd.type)}`}>{getLabel(cmd)}</span>
                </div>
                {currentStepIndex === idx ? (
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                ) : !isRunning && (
                  <span className="text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700 flex gap-3">
        {!isRunning ? (
          <button 
            onClick={onRun}
            disabled={program.length === 0}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Run Code
          </button>
        ) : (
          <button 
            onClick={onStop}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Stop
          </button>
        )}
        <button 
          onClick={onReset}
          disabled={isRunning}
          className="w-14 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          ↺
        </button>
      </div>
    </div>
  );
};

export default ProgramQueue;
