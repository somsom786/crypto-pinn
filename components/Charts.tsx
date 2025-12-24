import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MarketData } from '../types';

interface ChartProps {
  data: MarketData[];
}

export const PriceChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="h-48 w-full mt-4">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Real-Time Price Feed (1m Window)</div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            hide={true} 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            orientation="right" 
            tick={{fontSize: 10, fill: '#64748b'}} 
            stroke="#1e293b"
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip 
            contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}}
            itemStyle={{color: '#10b981'}}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};