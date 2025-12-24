import { OptionParams, PinnOutput } from '../types';

/**
 * Approximation of the error function (erf).
 * Abramowitz and Stegun 7.1.26
 */
function erf(x: number): number {
  const sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // Constants
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Standard Normal cumulative distribution function
 */
function cdf(x: number): number {
  return (1.0 + erf(x / Math.sqrt(2.0))) / 2.0;
}

/**
 * Standard Normal probability density function
 */
function pdf(x: number): number {
  return (1.0 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

/**
 * Simulates the inference pass of a trained Physics-Informed Neural Network (PINN).
 * In a real deployment, this would be an ONNX model run via onnxruntime-web.
 * For this demo, we use the analytical solution which the PINN converges to.
 */
export const runPinnInference = (params: OptionParams): PinnOutput => {
  const { S, K, T, r, sigma } = params;

  // Avoid division by zero at expiration
  const safeT = Math.max(T, 0.00001);

  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * safeT) / (sigma * Math.sqrt(safeT));
  const d2 = d1 - sigma * Math.sqrt(safeT);

  // Call Price
  const V = S * cdf(d1) - K * Math.exp(-r * safeT) * cdf(d2);

  // Greeks
  const delta = cdf(d1);
  const gamma = pdf(d1) / (S * sigma * Math.sqrt(safeT));
  const theta = -(S * pdf(d1) * sigma) / (2 * Math.sqrt(safeT)) - r * K * Math.exp(-r * safeT) * cdf(d2);

  return {
    V,
    delta,
    gamma,
    theta
  };
};

export const calculateHedge = (positionSize: number, delta: number): number => {
  // If we are Short 10 Calls (positionSize = -10)
  // Our Portfolio Delta is: -10 * delta
  // To be Delta Neutral (Total Delta = 0), we must hold + (10 * delta) ETH.
  // The 'hedgeRequired' is the net ETH balance we should have.
  
  return Math.abs(positionSize) * delta;
};