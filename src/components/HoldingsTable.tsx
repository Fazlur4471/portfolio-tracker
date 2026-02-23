import { TrendingUp, TrendingDown } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HoldingsTable({ holdings, loading, formatCurrency }: { holdings: any[], loading: boolean, formatCurrency: (val: number) => string }) {
  if (loading && holdings.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg w-full"></div>)}
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your portfolio is empty.</p>
        <p className="text-sm text-white/40 mt-1">Add your first transaction to see your holdings here.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-white/80 mb-4">Your Holdings</h3>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10 text-sm text-muted-foreground">
            <th className="pb-3 font-medium">Asset</th>
            <th className="pb-3 font-medium text-right">Qty</th>
            <th className="pb-3 font-medium text-right">Avg Price</th>
            <th className="pb-3 font-medium text-right">LTP</th>
            <th className="pb-3 font-medium text-right">Current Value</th>
            <th className="pb-3 font-medium text-right">Overall P&L</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
              <td className="py-4">
                <div className="font-semibold text-white/90">{h.ticker}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{h.name}</div>
              </td>
              <td className="py-4 text-right text-white/80">{h.qty}</td>
              <td className="py-4 text-right text-white/80">{h.avgPrice.toFixed(2)}</td>
              <td className="py-4 text-right">
                <div className="text-white/90 font-medium">{h.currentPrice.toFixed(2)}</div>
                <div className={`text-xs flex items-center justify-end gap-1 ${h.dayChangePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {h.dayChangePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(h.dayChangePercent).toFixed(2)}%
                </div>
              </td>
              <td className="py-4 text-right font-medium text-white/90">{formatCurrency(h.currentValue)}</td>
              <td className="py-4 text-right">
                <div className={`font-semibold ${h.totalPnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {h.totalPnl >= 0 ? '+' : ''}{formatCurrency(h.totalPnl)}
                </div>
                <div className={`text-xs ${h.totalPnlPercent >= 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                  {h.totalPnlPercent >= 0 ? '+' : ''}{h.totalPnlPercent.toFixed(2)}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
