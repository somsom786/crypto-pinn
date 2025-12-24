import React, { useState, useEffect, useCallback } from 'react';
import { fetchEthPrice } from './services/coinbaseService';
import { runPinnInference, calculateHedge } from './services/mathService';
import { analyzeRisk } from './services/geminiService';
import { LogEntry, MarketData, PinnOutput } from './types';
import TerminalLog from './components/TerminalLog';
import HedgeTicket from './components/HedgeTicket';
import { PriceChart } from './components/Charts';
import { Cpu, Wifi, Zap, Info } from 'lucide-react';

const POLLING_INTERVAL = 3000; // 3 seconds
const POSITION_SIZE = -10; // Short 10 Calls
const K = 3000;
const SIGMA = 0.7;
const RATE = 0.05;
const T = 1.0; // 1 Year to expiration

const App: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [history, setHistory] = useState<MarketData[]>([]);
  const [pinnResult, setPinnResult] = useState<PinnOutput>({ V: 0, delta: 0, gamma: 0, theta: 0 });
  const [hedgeAmount, setHedgeAmount] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("Initializing Neural Network...");
  const [isLoading, setIsLoading] = useState(true);

  const addLog = useCallback((level: LogEntry['level'], message: string) => {
    setLogs(prev => [
      ...prev.slice(-49), // Keep last 50 logs
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        level,
        message
      }
    ]);
  }, []);

  // Initialization simulation
  useEffect(() => {
    const initSequence = async () => {
      addLog('INFO', 'Initializing Physics-Informed Neural Network (PINN)...');
      await new Promise(r => setTimeout(r, 800));
      addLog('INFO', `Loading parameters: K=${K}, σ=${SIGMA}, r=${RATE}`);
      await new Promise(r => setTimeout(r, 800));
      addLog('INFO', 'Connecting to Binance Public API...');
      await new Promise(r => setTimeout(r, 800));
      setIsLoading(false);
    };
    initSequence();
  }, [addLog]);

  // Main Polling Logic
  useEffect(() => {
    if (isLoading) return;

    const tick = async () => {
      try {
        // 1. Fetch Price
        const price = await fetchEthPrice();
        setCurrentPrice(price);
        
        setHistory(prev => {
          const newData = [...prev, { price, timestamp: new Date().toLocaleTimeString() }];
          return newData.slice(-30); // Keep last 30 data points for chart
        });

        // 2. PINN Inference (Math Service)
        const inference = runPinnInference({ S: price, K, T, r: RATE, sigma: SIGMA });
        setPinnResult(inference);

        // 3. Decision Engine
        const hedge = calculateHedge(POSITION_SIZE, inference.delta);
        setHedgeAmount(hedge);

        // Logging
        addLog('INFO', `Tick: ETH $${price.toFixed(2)} | Δ: ${inference.delta.toFixed(3)}`);
        
        if (Math.random() > 0.7) { // Don't log action every single tick to avoid noise
            addLog('ACTION', `Rebalancing... BUY ${hedge.toFixed(4)} ETH`);
        }

      } catch (e) {
        addLog('WARN', 'Data fetch failed, retrying...');
      }
    };

    // Initial tick
    tick();

    const interval = setInterval(tick, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoading, addLog]);

  // AI Analysis Trigger (Debounced effect usually, but simplified here)
  useEffect(() => {
    if (currentPrice > 0 && pinnResult.delta > 0) {
      // Small chance to run AI analysis to save quota and reduce noise, or run on specific events
      // For demo, we run it occasionally
      const runAI = async () => {
         addLog('AI', 'Analyzing market structure...');
         const analysis = await analyzeRisk(currentPrice, pinnResult, hedgeAmount);
         setAiAnalysis(analysis);
         addLog('AI', 'Risk report updated.');
      };
      
      // Run AI only on significant price changes or every X ticks. 
      // For this demo, let's just trigger it once when price is stable or initially.
      const timer = setTimeout(runAI, 5000); 
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hedgeAmount]); // Re-run when hedge amount changes significantly

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center flex-col text-emerald-500 font-mono">
        <div className="animate-spin mb-4"><Cpu size={48} /></div>
        <div className="text-xl">Bootstrapping AI Hedger...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-200 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <Zap className="text-emerald-400 fill-emerald-400/20" />
              EtherHedge AI <span className="text-slate-500 font-normal text-sm border border-slate-700 rounded px-2 py-0.5">v2.1.0-beta</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-lg">
              Real-time delta-neutral hedging utilizing Physics-Informed Neural Networks (PINN) and Live Binance Market Data.
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-900">
                <Wifi size={12} />
                <span>API: ONLINE</span>
             </div>
             <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/30 px-3 py-1.5 rounded-full border border-purple-900">
                <Cpu size={12} />
                <span>PINN: CONVERGED</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Data & Controls */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Action Ticket */}
            <HedgeTicket 
              price={currentPrice} 
              pinnData={pinnResult} 
              hedgeAmount={hedgeAmount} 
            />

            {/* Charts Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <PriceChart data={history} />
            </div>

            {/* AI Insight Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Info size={16} /> Gemini Risk Analyst
              </h3>
              <div className="bg-slate-950/50 p-4 rounded-lg border-l-2 border-purple-500">
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{aiAnalysis}"
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar info & Logs */}
          <div className="space-y-6">
            
            {/* Parameters Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Model Config (Black-Scholes)</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Underlying</span>
                  <span className="font-mono">ETH (Ethereum)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Strike (K)</span>
                  <span className="font-mono text-white">$3000.00</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Volatility (σ)</span>
                  <span className="font-mono text-yellow-400">70.0%</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Risk-Free Rate (r)</span>
                  <span className="font-mono">5.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expiry (T)</span>
                  <span className="font-mono">1.0 Yrs</span>
                </div>
              </div>
            </div>

            {/* Terminal Output */}
            <TerminalLog logs={logs} />
            
            <div className="text-[10px] text-slate-600 text-center leading-tight">
              DISCLAIMER: This is a simulation for educational purposes only. 
              Do not use for real financial trading.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default App;