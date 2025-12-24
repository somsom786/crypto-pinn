import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalLogProps {
  logs: LogEntry[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'WARN': return 'text-yellow-400';
      case 'ACTION': return 'text-emerald-400 font-bold';
      case 'AI': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-64 overflow-hidden flex flex-col font-mono text-xs shadow-inner shadow-black/50">
      <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
        <span className="text-slate-500 uppercase tracking-widest text-[10px]">System Output // Execution Log</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3">
            <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
            <span className={`${getLevelColor(log.level)}`}>{log.level} ::</span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLog;