'use client';

import { useState, useEffect } from 'react';
import HoldingsTable from './HoldingsTable';
import AddTransactionModal from './AddTransactionModal';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export type PortfolioItem = {
  id: string;
  ticker: string;
  quantity: number;
  average_price: number;
  is_buy: boolean;
};

export type MarketData = {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  name: string;
  error?: string;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch portfolio from DB
  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data || []);

      // Fetch market data for these tickers
      const tickers = Array.from(new Set(data.map((item: { ticker: string }) => item.ticker)));
      if (tickers.length > 0) {
        fetchMarketData(tickers.join(','));
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setLoading(false);
    }
  };

  // Fetch market data from Yahoo Finance API
  const fetchMarketData = async (tickers: string) => {
    try {
      const res = await fetch(`/api/market?tickers=${tickers}`);
      const data = await res.json();

      const marketMap: Record<string, MarketData> = {};
      data.forEach((item: MarketData) => {
        marketMap[item.ticker] = item;
      });

      setMarketData(marketMap);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Refresh prices every 60 seconds
    const interval = setInterval(() => {
      const tickers = Array.from(new Set(portfolio.map(item => item.ticker)));
      if (tickers.length > 0) {
        fetchMarketData(tickers.join(','));
      }
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate Aggregated Data
  const holdingsMap: Record<string, { qty: number, invested: number }> = {};
  portfolio.forEach(tx => {
    if (!holdingsMap[tx.ticker]) holdingsMap[tx.ticker] = { qty: 0, invested: 0 };
    if (tx.is_buy) {
      holdingsMap[tx.ticker].qty += Number(tx.quantity);
      holdingsMap[tx.ticker].invested += Number(tx.quantity) * Number(tx.average_price);
    } else {
      holdingsMap[tx.ticker].qty -= Number(tx.quantity);
      holdingsMap[tx.ticker].invested -= Number(tx.quantity) * Number(tx.average_price); // simplistic avg cost reduction
    }
  });

  const activeHoldings = Object.keys(holdingsMap).filter(t => holdingsMap[t].qty > 0).map(ticker => {
    const qty = holdingsMap[ticker].qty;
    const invested = holdingsMap[ticker].invested;
    const avgPrice = invested / qty;
    const market = marketData[ticker];
    const currentPrice = market?.price || 0;
    const currentValue = qty * currentPrice;
    const dayChange = (market?.change || 0) * qty;
    const totalPnl = currentValue - invested;
    const totalPnlPercent = invested > 0 ? (totalPnl / invested) * 100 : 0;

    return {
      ticker,
      name: market?.name || ticker,
      qty,
      avgPrice,
      invested,
      currentPrice,
      currentValue,
      dayChange,
      dayChangePercent: market?.changePercent || 0,
      totalPnl,
      totalPnlPercent,
      currency: market?.currency || 'INR'
    };
  });

  const totalInvested = activeHoldings.reduce((sum, h) => sum + h.invested, 0);
  const totalValue = activeHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalDayChange = activeHoldings.reduce((sum, h) => sum + h.dayChange, 0);
  const overallPnl = totalValue - totalInvested;
  const overallPnlPercent = totalInvested > 0 ? (overallPnl / totalInvested) * 100 : 0;

  // Pie chart data
  const chartData = activeHoldings.map(h => ({ name: h.ticker, value: h.currentValue }));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white/90">Overview</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
        >
          + Add Transaction
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors border border-white/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><DollarSign size={20} /></div>
            <span className="font-medium">Total Value</span>
          </div>
          <div className="text-3xl font-bold">{loading ? '...' : formatCurrency(totalValue)}</div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors border border-white/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Activity size={20} /></div>
            <span className="font-medium">Invested Amount</span>
          </div>
          <div className="text-3xl font-bold text-white/90">{loading ? '...' : formatCurrency(totalInvested)}</div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors border border-white/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className={`p-2 rounded-lg ${totalDayChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {totalDayChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <span className="font-medium">Day&apos;s P&amp;L</span>
          </div>
          <div className="flex items-end gap-2">
            <div className={`text-3xl font-bold ${totalDayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loading ? '...' : `${totalDayChange >= 0 ? '+' : ''}${formatCurrency(totalDayChange)}`}
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors border border-white/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className={`p-2 rounded-lg ${overallPnl >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {overallPnl >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </div>
            <span className="font-medium">Overall P&L</span>
          </div>
          <div className="flex items-end gap-2">
            <div className={`text-3xl font-bold ${overallPnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loading ? '...' : `${overallPnl >= 0 ? '+' : ''}${formatCurrency(overallPnl)}`}
            </div>
            <div className={`mb-1 font-medium ${overallPnl >= 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
              ({overallPnlPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Allocation Area */}
        <div className="glass rounded-2xl p-6 lg:col-span-1 border border-white/5 flex flex-col justify-center min-h-[300px]">
          <h3 className="text-lg font-medium text-white/80 mb-6">Asset Allocation</h3>
          {chartData.length > 0 ? (
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm flex-1 flex items-center justify-center">
              No active holdings to display allocation.
            </div>
          )}
        </div>

        {/* Holdings Table */}
        <div className="glass rounded-2xl p-6 lg:col-span-2 border border-white/5 overflow-x-auto">
          <HoldingsTable holdings={activeHoldings} loading={loading} formatCurrency={formatCurrency} />
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPortfolio}
      />
    </div>
  );
}
