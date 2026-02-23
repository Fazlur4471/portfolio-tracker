// Financial Analysis Utility Functions

export type OHLCVData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type AnalysisResult = {
  signal: 'BUY' | 'SELL' | 'HOLD';
  signalStrength: number; // 0-100
  signalReason: string;
  sma50: number;
  sma200: number;
  rsi: number;
  cagr: number;
  volatility: number;
  projection1m: number;
  projection6m: number;
  projection1y: number;
};

export type PortfolioHealth = {
  grade: 'A' | 'B' | 'C' | 'D';
  diversificationScore: number; // 0-100
  concentrationRisk: string;
  volatilityRating: 'Low' | 'Medium' | 'High';
  suggestions: string[];
};

/**
 * Calculate Simple Moving Average
 */
export function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      sma.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return sma;
}

/**
 * Calculate Relative Strength Index (14-period)
 */
export function calculateRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50; // neutral if insufficient data

  const changes = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  const recentChanges = changes.slice(-period);
  let gains = 0, losses = 0;

  for (const change of recentChanges) {
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

/**
 * Get Buy/Hold/Sell signal based on technical indicators
 */
export function getSignal(
  sma50Current: number,
  sma200Current: number,
  sma50Prev: number,
  sma200Prev: number,
  rsi: number,
  currentPrice: number
): { signal: 'BUY' | 'SELL' | 'HOLD'; strength: number; reason: string } {
  let score = 0; // positive = buy, negative = sell
  const reasons: string[] = [];

  // Golden Cross / Death Cross (strongest signal)
  if (sma50Prev <= sma200Prev && sma50Current > sma200Current) {
    score += 40;
    reasons.push('Golden Cross detected (50-MA crossed above 200-MA)');
  } else if (sma50Prev >= sma200Prev && sma50Current < sma200Current) {
    score -= 40;
    reasons.push('Death Cross detected (50-MA crossed below 200-MA)');
  }

  // MA trend direction
  if (sma50Current > sma200Current) {
    score += 20;
    reasons.push('Bullish trend (50-MA above 200-MA)');
  } else if (sma50Current < sma200Current) {
    score -= 20;
    reasons.push('Bearish trend (50-MA below 200-MA)');
  }

  // Price relative to MAs
  if (currentPrice > sma50Current && sma50Current > 0) {
    score += 10;
    reasons.push('Price trading above 50-day average');
  } else if (currentPrice < sma200Current && sma200Current > 0) {
    score -= 10;
    reasons.push('Price trading below 200-day average');
  }

  // RSI
  if (rsi < 30) {
    score += 15;
    reasons.push(`Oversold (RSI: ${rsi.toFixed(0)})`);
  } else if (rsi > 70) {
    score -= 15;
    reasons.push(`Overbought (RSI: ${rsi.toFixed(0)})`);
  } else {
    reasons.push(`RSI neutral at ${rsi.toFixed(0)}`);
  }

  let signal: 'BUY' | 'SELL' | 'HOLD';
  if (score >= 25) signal = 'BUY';
  else if (score <= -25) signal = 'SELL';
  else signal = 'HOLD';

  return {
    signal,
    strength: Math.min(Math.abs(score), 100),
    reason: reasons[0] || 'No strong signals detected',
  };
}

/**
 * Calculate Compound Annual Growth Rate
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Calculate annualized volatility from daily returns
 */
export function calculateVolatility(closes: number[]): number {
  if (closes.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const dailyVol = Math.sqrt(variance);

  // Annualize (252 trading days)
  return dailyVol * Math.sqrt(252) * 100;
}

/**
 * Project future price based on historical CAGR
 */
export function projectPrice(currentPrice: number, cagr: number, months: number): number {
  const years = months / 12;
  return currentPrice * Math.pow(1 + cagr / 100, years);
}

/**
 * Calculate portfolio health score
 */
export function calculatePortfolioHealth(
  holdings: { ticker: string; currentValue: number; volatility?: number }[]
): PortfolioHealth {
  const suggestions: string[] = [];
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  if (totalValue === 0) {
    return {
      grade: 'D',
      diversificationScore: 0,
      concentrationRisk: 'No holdings',
      volatilityRating: 'Low',
      suggestions: ['Start building your portfolio by adding some investments.'],
    };
  }

  // Diversification score (Herfindahl Index approach)
  const weights = holdings.map(h => h.currentValue / totalValue);
  const hhi = weights.reduce((sum, w) => sum + w * w, 0);
  // HHI = 1 means fully concentrated, 1/n means equally distributed
  const maxHHI = 1;
  const minHHI = holdings.length > 0 ? 1 / holdings.length : 1;
  const diversificationScore = holdings.length <= 1 ? 0
    : Math.round((1 - (hhi - minHHI) / (maxHHI - minHHI)) * 100);

  // Concentration risk
  const maxWeight = Math.max(...weights);
  let concentrationRisk = 'Low';
  if (maxWeight > 0.5) {
    concentrationRisk = 'High — more than 50% in one stock';
    suggestions.push(`Consider reducing your ${holdings[weights.indexOf(maxWeight)].ticker} position — it's ${(maxWeight * 100).toFixed(0)}% of your portfolio.`);
  } else if (maxWeight > 0.3) {
    concentrationRisk = 'Medium — over 30% in one stock';
    suggestions.push('Your largest holding is sizable. Consider rebalancing if it grows further.');
  }

  // Number of holdings
  if (holdings.length < 3) {
    suggestions.push('Consider adding more stocks for better diversification (aim for 5-10 holdings).');
  } else if (holdings.length > 15) {
    suggestions.push('You have many holdings. Consider consolidating into your highest-conviction picks.');
  }

  // Volatility
  const avgVol = holdings.reduce((sum, h) => sum + (h.volatility || 20), 0) / holdings.length;
  let volatilityRating: 'Low' | 'Medium' | 'High' = 'Medium';
  if (avgVol < 15) volatilityRating = 'Low';
  else if (avgVol > 30) {
    volatilityRating = 'High';
    suggestions.push('Your portfolio has high volatility. Consider adding some stable, low-beta stocks.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your portfolio looks well-balanced! Keep monitoring and rebalancing periodically.');
  }

  // Grade
  let grade: 'A' | 'B' | 'C' | 'D' = 'C';
  const score = diversificationScore - (maxWeight > 0.5 ? 30 : maxWeight > 0.3 ? 15 : 0)
    + (holdings.length >= 3 && holdings.length <= 15 ? 20 : 0)
    + (volatilityRating === 'Low' ? 15 : volatilityRating === 'Medium' ? 5 : -10);

  if (score >= 70) grade = 'A';
  else if (score >= 45) grade = 'B';
  else if (score >= 20) grade = 'C';
  else grade = 'D';

  return { grade, diversificationScore, concentrationRisk, volatilityRating, suggestions };
}

/**
 * SIP Calculator
 */
export function calculateSIP(monthlyAmount: number, annualReturn: number, years: number) {
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  const totalInvested = monthlyAmount * months;

  // FV of annuity: P * [((1+r)^n - 1) / r] * (1+r)
  const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const wealthGained = futureValue - totalInvested;

  // Monthly data for chart
  const monthlyData = [];
  let runningInvested = 0;
  let runningValue = 0;

  for (let m = 1; m <= months; m++) {
    runningInvested += monthlyAmount;
    runningValue = (runningValue + monthlyAmount) * (1 + monthlyRate);
    if (m % (months <= 60 ? 1 : 3) === 0 || m === months) {
      monthlyData.push({
        month: m,
        year: (m / 12).toFixed(1),
        invested: Math.round(runningInvested),
        value: Math.round(runningValue),
      });
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(wealthGained),
    returnMultiple: (futureValue / totalInvested).toFixed(2),
    monthlyData,
  };
}

/**
 * FD Calculator
 */
export function calculateFD(principal: number, annualRate: number, years: number) {
  // Quarterly compounding (standard Indian FD)
  const n = 4;
  const maturityAmount = principal * Math.pow(1 + annualRate / (100 * n), n * years);
  const interest = maturityAmount - principal;

  return {
    principal: Math.round(principal),
    maturityAmount: Math.round(maturityAmount),
    interestEarned: Math.round(interest),
    effectiveReturn: ((maturityAmount / principal - 1) * 100).toFixed(2),
  };
}

/**
 * Get allocation suggestion based on risk profile
 */
export function getAllocationSuggestion(riskProfile: 'conservative' | 'balanced' | 'aggressive') {
  const allocations = {
    conservative: {
      equity: 30, debt: 50, gold: 10, liquid: 10,
      label: 'Conservative',
      description: 'Capital preservation focused. Ideal for near-term goals (1-3 years) or low risk tolerance.',
      suggestions: [
        'Prefer large-cap index funds (Nifty 50, Sensex)',
        'Consider PPF and NPS for tax-efficient debt allocation',
        'Gold via Sovereign Gold Bonds (SGB) for zero making charges',
        'Keep 6 months expenses in liquid fund / savings account',
      ],
    },
    balanced: {
      equity: 60, debt: 25, gold: 10, liquid: 5,
      label: 'Balanced',
      description: 'Growth with stability. Ideal for medium-term goals (3-7 years).',
      suggestions: [
        'Mix of Nifty 50 index + Nifty Next 50 for core equity',
        'Add 1-2 quality mid-cap stocks for alpha generation',
        'Debt mutual funds or corporate bonds for stable returns',
        'SIP into ELSS funds for Section 80C tax benefits',
      ],
    },
    aggressive: {
      equity: 80, debt: 10, gold: 5, liquid: 5,
      label: 'Aggressive',
      description: 'Maximum growth potential. Ideal for long-term goals (7+ years) with high risk tolerance.',
      suggestions: [
        'Core: Nifty 50 index fund (40%), direct stock picks (40%)',
        'Explore quality mid-cap and small-cap opportunities',
        'Consider international diversification (US S&P 500 index)',
        'Keep minimal debt allocation for rebalancing opportunities',
      ],
    },
  };

  return allocations[riskProfile];
}
