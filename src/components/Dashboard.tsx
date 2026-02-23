'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import HoldingsTable from './HoldingsTable';
import AddTransactionModal from './AddTransactionModal';
import { TrendingUp, TrendingDown, DollarSign, Activity, Clock, History } from 'lucide-react';
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

// Indian market hours: 9:15 AM - 3:30 PM IST (Mon-Fri)
function getMarketStatus(): { isOpen: boolean; label: string } {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const istTime = new Date(utc + istOffset);
  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  if (day === 0 || day === 6) {
    return { isOpen: false, label: 'Market Closed (Weekend)' };
  }

  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  if (totalMinutes >= marketOpen && totalMinutes <= marketClose) {
    return { isOpen: true, label: 'NSE Market Open' };
  }

  if (totalMinutes < marketOpen) {
    return { isOpen: false, label: 'Pre-Market' };
  }

  return { isOpen: false, label: 'Market Closed' };
}

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [marketStatus, setMarketStatus] = useState(getMarketStatus());

  // Fetch market data from Yahoo Finance API
  const fetchMarketData = useCallback(async (tickers: string) => {
    try {
      const res = await fetch(`/api/market?tickers=${tickers}`);
      const data = await res.json();

      const marketMap: Record<string, MarketData> = {};
      data.forEach((item: MarketData) => {
        marketMap[item.ticker] = item;
      });

      setMarketData(marketMap);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch portfolio from DB
  const fetchPortfolio = useCallback(async () => {
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
  }, [fetchMarketData]);

  // Delete transaction
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchPortfolio();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Refresh prices every 60 seconds
    const priceInterval = setInterval(() => {
      const tickers = Array.from(new Set(portfolio.map(item => item.ticker)));
      if (tickers.length > 0) {
        fetchMarketData(tickers.join(','));
      }
    }, 60000);
    // Update market status every minute
    const statusInterval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000);
    return () => {
      clearInterval(priceInterval);
      clearInterval(statusInterval);
    };
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
      holdingsMap[tx.ticker].invested -= Number(tx.quantity) * Number(tx.average_price);
    }
  });

  // Build a map of ticker -> transaction ids for delete functionality
  const tickerTransactionIds: Record<string, string[]> = {};
  portfolio.forEach(tx => {
    if (!tickerTransactionIds[tx.ticker]) tickerTransactionIds[tx.ticker] = [];
    tickerTransactionIds[tx.ticker].push(tx.id);
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
      currency: market?.currency || 'INR',
      transactionIds: tickerTransactionIds[ticker] || [],
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white/90">Overview</h2>
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs font-medium text-muted-foreground">{marketStatus.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>Updated {formatTime(lastUpdated)}</span>
            </div>
          )}
          <Link
            href="/history"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-4 py-2 rounded-lg font-medium transition-all border border-white/10"
          >
            <History size={16} />
            History
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
          >
            + Add Transaction
          </button>
        </div>
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
        {/* Allocation Pie Chart */}
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
          <HoldingsTable
            holdings={activeHoldings}
            loading={loading}
            formatCurrency={formatCurrency}
            onDelete={handleDelete}
          />
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
