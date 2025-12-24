import { GoogleGenAI } from "@google/genai";
import { PinnOutput } from "../types";

let aiClient: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const analyzeRisk = async (
  price: number,
  pinnOutput: PinnOutput,
  hedgeAmount: number
): Promise<string> => {
  if (!aiClient) return "AI Analyst offline: Check API Key.";

  try {
    const prompt = `
      You are a Lead Quantitative Risk Manager at a High-Frequency Trading firm.
      
      Market Data:
      - Asset: ETH/USD
      - Spot Price: $${price.toFixed(2)}
      - Implied Volatility: 70%
      - Strategy: Short 10 Call Options (Strike $3000)
      
      Model Output (Black-Scholes PINN):
      - Theoretical Option Price: $${pinnOutput.V.toFixed(2)}
      - Delta (Sensitivity): ${pinnOutput.delta.toFixed(4)}
      - Gamma (Convexity): ${pinnOutput.gamma.toFixed(6)}
      
      Current Hedge Requirement:
      - We need to hold ${hedgeAmount.toFixed(4)} ETH to be Delta Neutral.

      Task: Provide a concise, 1-sentence analytical comment on the current risk exposure or the "Greeks". Sound professional and mathematical.
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis failed due to connectivity.";
  }
};