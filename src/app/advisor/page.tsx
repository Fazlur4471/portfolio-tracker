'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateSMA, calculateRSI, getSignal, calculateCAGR, calculateVolatility, projectPrice, calculatePortfolioHealth, type PortfolioHealth } from '@/lib/analysis';

type PortfolioItem = {
  id: string;
  ticker: string;
  quantity: number;
  average_price: number;
  is_buy: boolean;
};

type MarketData = {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
};

type HistoricalData = {
  ticker: string;
  quotes: { date: string; close: number }[];
  sma50: number[];
  sma200: number[];
  meta: { name: string; currency: string };
};

type StockAnalysis = {
  ticker: string;
  name: string;
  currentPrice: number;
  invested: number;
  currentValue: number;
  qty: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  signalStrength: number;
  signalReason: string;
  cagr: number;
  volatility: number;
  projection1m: number;
  projection6m: number;
  projection1y: number;
  chartData: { date: string; price: number }[];
  pnl: number;
  pnlPercent: number;
};

export default function AdvisorPage() {
  const [analyses, setAnalyses] = useState<StockAnalysis[]>([]);
  const [health, setHealth] = useState<PortfolioHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const analyze = async () => {
      try {
        // Fetch portfolio
        const portfolioRes = await fetch('/api/portfolio');
        const portfolioData: PortfolioItem[] = await portfolioRes.json();

        // Aggregate holdings
        const holdingsMap: Record<string, { qty: number; invested: number }> = {};
        portfolioData.forEach(tx => {
          if (!holdingsMap[tx.ticker]) holdingsMap[tx.ticker] = { qty: 0, invested: 0 };
          if (tx.is_buy) {
            holdingsMap[tx.ticker].qty += Number(tx.quantity);
            holdingsMap[tx.ticker].invested += Number(tx.quantity) * Number(tx.average_price);
          } else {
            holdingsMap[tx.ticker].qty -= Number(tx.quantity);
            holdingsMap[tx.ticker].invested -= Number(tx.quantity) * Number(tx.average_price);
          }
        });

        const activeTickers = Object.keys(holdingsMap).filter(t => holdingsMap[t].qty > 0);

        if (activeTickers.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch market data
        const marketRes = await fetch(`/api/market?tickers=${activeTickers.join(',')}`);
        const marketData: MarketData[] = await marketRes.json();
        const marketMap: Record<string, MarketData> = {};
        marketData.forEach(m => { marketMap[m.ticker] = m; });

        // Fetch historical data for each ticker
        const results: StockAnalysis[] = [];
        for (const ticker of activeTickers) {
          try {
            const histRes = await fetch(`/api/market/historical?ticker=${ticker}&period=1y`);
            const histData: HistoricalData = await histRes.json();

            if (histData.quotes && histData.quotes.length > 0) {
              const closes = histData.quotes.map(q => q.close);
              const sma50 = histData.sma50;
              const sma200 = histData.sma200;
              const rsi = calculateRSI(closes);
              const volatility = calculateVolatility(closes);
              const currentPrice = marketMap[ticker]?.price || closes[closes.length - 1];

              // Get signal
              const sma50Current = sma50[sma50.length - 1] || 0;
              const sma200Current = sma200[sma200.length - 1] || 0;
              const sma50Prev = sma50[sma50.length - 2] || 0;
              const sma200Prev = sma200[sma200.length - 2] || 0;

              const signalResult = getSignal(sma50Current, sma200Current, sma50Prev, sma200Prev, rsi, currentPrice);

              // CAGR from 1-year data
              const startPrice = closes[0];
              const endPrice = closes[closes.length - 1];
              const cagr = calculateCAGR(startPrice, endPrice, 1);

              // Projections
              const projection1m = projectPrice(currentPrice, cagr, 1);
              const projection6m = projectPrice(currentPrice, cagr, 6);
              const projection1y = projectPrice(currentPrice, cagr, 12);

              const qty = holdingsMap[ticker].qty;
              const invested = holdingsMap[ticker].invested;
              const currentValue = qty * currentPrice;

              results.push({
                ticker,
                name: histData.meta?.name || marketMap[ticker]?.name || ticker,
                currentPrice,
                invested,
                currentValue,
                qty,
                signal: signalResult.signal,
                signalStrength: signalResult.strength,
                signalReason: signalResult.reason,
                cagr,
                volatility,
                projection1m,
                projection6m,
                projection1y,
                chartData: histData.quotes.filter((_, i) => i % 3 === 0 || i === histData.quotes.length - 1).map(q => ({
                  date: q.date.substring(5), // "MM-DD"
                  price: Number(q.close.toFixed(2)),
                })),
                pnl: currentValue - invested,
                pnlPercent: invested > 0 ? ((currentValue - invested) / invested) * 100 : 0,
              });
            }
          } catch (err) {
            console.error(`Failed to analyze ${ticker}:`, err);
          }
        }

        setAnalyses(results);

        // Calculate portfolio health
        const healthData = calculatePortfolioHealth(
          results.map(r => ({
            ticker: r.ticker,
            currentValue: r.currentValue,
            volatility: r.volatility,
          }))
        );
        setHealth(healthData);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Failed to load analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, []);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const signalConfig = {
    BUY: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: ArrowUp },
    SELL: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ArrowDown },
    HOLD: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Minus },
  };

  const gradeConfig: Record<string, { color: string; bg: string }> = {
    A: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    B: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    C: { color: 'text-amber-500', bg: 'bg-amber-500/10' },
    D: { color: 'text-red-500', bg: 'bg-red-500/10' },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 flex items-center gap-3">
            <Brain className="text-primary" size={32} />
            AI Investment Advisor
          </h1>
          <p className="text-muted-foreground mt-2">
            Technical analysis, buy/sell signals, and portfolio health scoring based on real market data.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-muted-foreground">Analyzing your portfolio...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-white/5 text-center">
            <Brain className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-white/70 text-lg">No active holdings to analyze.</p>
            <p className="text-muted-foreground mt-2">Add some stocks from the Dashboard to get AI-powered analysis.</p>
          </div>
        ) : (
          <>
            {/* Portfolio Health */}
            {health && (
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-primary" />
                  Portfolio Health Report
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className={`text-4xl font-black ${gradeConfig[health.grade]?.color}`}>
                      {health.grade}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Overall Grade</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className="text-3xl font-bold text-white/90">{health.diversificationScore}</div>
                    <div className="text-xs text-muted-foreground mt-1">Diversification Score</div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                      <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${health.diversificationScore}%` }} />
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className={`text-lg font-semibold ${health.volatilityRating === 'Low' ? 'text-emerald-500' :
                      health.volatilityRating === 'Medium' ? 'text-amber-500' : 'text-red-500'
                      }`}>{health.volatilityRating}</div>
                    <div className="text-xs text-muted-foreground mt-1">Volatility Rating</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <div className="text-sm font-medium text-white/80">{health.concentrationRisk}</div>
                    <div className="text-xs text-muted-foreground mt-1">Concentration Risk</div>
                  </div>
                </div>
                {health.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm mb-2 last:mb-0">
                    {s.includes('well-balanced') || s.includes('Keep')
                      ? <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      : <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />}
                    <span className="text-white/70">{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyses.map(analysis => {
                const config = signalConfig[analysis.signal];
                const SignalIcon = config.icon;
                return (
                  <div key={analysis.ticker} className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white/90">{analysis.ticker}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">{analysis.name}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${config.bg} ${config.color} border ${config.border}`}>
                        <SignalIcon size={14} />
                        {analysis.signal}
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="h-32 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analysis.chartData}>
                          <defs>
                            <linearGradient id={`grad-${analysis.ticker}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={analysis.pnl >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={analysis.pnl >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Price']}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={analysis.pnl >= 0 ? '#10b981' : '#ef4444'}
                            fill={`url(#grad-${analysis.ticker})`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Signal Reason */}
                    <p className="text-xs text-muted-foreground mb-4 bg-white/5 px-3 py-2 rounded-lg">
                      💡 {analysis.signalReason}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground">P&L</div>
                        <div className={`text-sm font-bold ${analysis.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {analysis.pnl >= 0 ? '+' : ''}{analysis.pnlPercent.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground">CAGR</div>
                        <div className={`text-sm font-bold ${analysis.cagr >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {analysis.cagr >= 0 ? '+' : ''}{analysis.cagr.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5">
                        <div className="text-xs text-muted-foreground">Volatility</div>
                        <div className="text-sm font-bold text-white/80">{analysis.volatility.toFixed(0)}%</div>
                      </div>
                    </div>

                    {/* Projections */}
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="text-xs text-muted-foreground mb-2">Projected Price (based on historical CAGR)</div>
                      <div className="grid grid-cols-3 gap-3 text-center text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs">1 Month</div>
                          <div className="font-semibold text-white/80">₹{analysis.projection1m.toFixed(0)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">6 Months</div>
                          <div className="font-semibold text-white/80">₹{analysis.projection6m.toFixed(0)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">1 Year</div>
                          <div className="font-semibold text-white/80">₹{analysis.projection1y.toFixed(0)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Investment Summary */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Invested: </span>
                        <span className="text-white/80 font-medium">{formatCurrency(analysis.invested)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current: </span>
                        <span className={`font-medium ${analysis.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(analysis.currentValue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div className="text-center text-xs text-muted-foreground/60 py-4 max-w-2xl mx-auto">
              ⚠️ This analysis is based on technical indicators and historical data. It is NOT financial advice.
              Past performance does not guarantee future results. Always consult a SEBI-registered advisor before making investment decisions.
            </div>
          </>
        )}
      </div>

      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-0" />
    </div>
  );
}
