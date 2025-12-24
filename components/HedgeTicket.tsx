import React from 'react';
import { ArrowUpRight, Activity, TrendingUp } from 'lucide-react';
import { PinnOutput } from '../types';

interface HedgeTicketProps {
  price: number;
  pinnData: PinnOutput;
  hedgeAmount: number;
}

const HedgeTicket: React.FC<HedgeTicketProps> = ({ price, pinnData, hedgeAmount }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-emerald-400 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            <Activity className="w-4 h-4" /> Live Hedge Ticket
          </h2>
          <p className="text-slate-500 text-xs mt-1">Source: Binance / Live Aggregator</p>
        </div>
        <div className="text-right">
            <div className="text-2xl font-mono font-bold text-white">${price.toFixed(2)}</div>
            <div className="text-xs text-slate-400">ETH/USD Spot</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
            <div className="text-slate-500 text-xs uppercase mb-1">AI Valuation (V)</div>
            <div className="text-white font-mono">${pinnData.V.toFixed(2)}</div>
        </div>
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
            <div className="text-slate-500 text-xs uppercase mb-1">AI Delta (Δ)</div>
            <div className="text-purple-400 font-mono">{pinnData.delta.toFixed(4)}</div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Position:</span>
            <span className="text-red-400 font-bold text-sm">SHORT 10 CALLS</span>
        </div>
        
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4 flex items-center justify-between mt-4">
            <div>
                <div className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">Action Required</div>
                <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                    BUY {hedgeAmount.toFixed(4)} ETH
                </div>
            </div>
            <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 animate-pulse">
                <ArrowUpRight className="w-6 h-6" />
            </div>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-emerald-500/70 uppercase tracking-widest animate-pulse">
                System Status: Executing...
            </span>
        </div>
      </div>
    </div>
  );
};

export default HedgeTicket;