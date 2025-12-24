export interface MarketData {
  price: number;
  timestamp: string;
}

export interface OptionParams {
  S: number; // Spot Price
  K: number; // Strike Price
  T: number; // Time to Maturity (Years)
  r: number; // Risk-free rate
  sigma: number; // Volatility
}

export interface PinnOutput {
  V: number; // Option Price (Call)
  delta: number; // dV/dS
  gamma: number; // d2V/dS2
  theta: number; // dV/dt
}

export interface HedgePosition {
  contracts: number; // Negative for short, Positive for long
  contractSize: number; // Usually 1 for crypto, 100 for traditional
  currentDelta: number;
  hedgeRequired: number; // Amount of underlying to buy/sell
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ACTION' | 'AI';
  message: string;
}