'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';

type Transaction = {
  id: string;
  ticker: string;
  quantity: number;
  average_price: number;
  is_buy: boolean;
  created_at: string;
};

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'buy') return tx.is_buy;
    if (filter === 'sell') return !tx.is_buy;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const totalBuyValue = transactions.filter(t => t.is_buy).reduce((s, t) => s + t.quantity * t.average_price, 0);
  const totalSellValue = transactions.filter(t => !t.is_buy).reduce((s, t) => s + t.quantity * t.average_price, 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Complete record of all your buy and sell transactions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Clock size={18} /></div>
              <span className="font-medium text-sm">Total Transactions</span>
            </div>
            <div className="text-2xl font-bold text-white/90">{transactions.length}</div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp size={18} /></div>
              <span className="font-medium text-sm">Total Bought</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalBuyValue)}</div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><TrendingDown size={18} /></div>
              <span className="font-medium text-sm">Total Sold</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSellValue)}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white/80 flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              Transactions
            </h3>
            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
              {(['all', 'buy', 'sell'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${filter === f
                    ? f === 'buy' ? 'bg-emerald-500 text-white shadow-md' : f === 'sell' ? 'bg-red-500 text-white shadow-md' : 'bg-primary text-white shadow-md'
                    : 'text-muted-foreground hover:text-white'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg w-full"></div>)}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found.</p>
              <p className="text-sm text-white/40 mt-1">Add your first transaction from the Dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Ticker</th>
                    <th className="pb-3 font-medium text-center">Type</th>
                    <th className="pb-3 font-medium text-right">Qty</th>
                    <th className="pb-3 font-medium text-right">Price</th>
                    <th className="pb-3 font-medium text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-sm text-white/70">{formatDate(tx.created_at)}</td>
                      <td className="py-4 font-semibold text-white/90">{tx.ticker}</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.is_buy
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                          }`}>
                          {tx.is_buy ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="py-4 text-right text-white/80">{tx.quantity}</td>
                      <td className="py-4 text-right text-white/80">{formatCurrency(tx.average_price)}</td>
                      <td className="py-4 text-right font-medium text-white/90">
                        {formatCurrency(tx.quantity * tx.average_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-0" />
    </main>
  );
}
