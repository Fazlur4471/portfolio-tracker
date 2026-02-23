'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isBuy, setIsBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          quantity: Number(quantity),
          average_price: Number(price),
          is_buy: isBuy,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save transaction');
      }

      setTicker('');
      setQuantity('');
      setPrice('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-md rounded-2xl p-6 relative border border-white/10 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-6">
          Add Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-lg">
            <button
              type="button"
              onClick={() => setIsBuy(true)}
              className={`py-2 text-sm font-medium rounded-md transition-all ${isBuy ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setIsBuy(false)}
              className={`py-2 text-sm font-medium rounded-md transition-all ${!isBuy ? 'bg-destructive text-white shadow-md' : 'text-muted-foreground hover:text-white'}`}
            >
              Sell
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Ticker Symbol</label>
            <input
              type="text"
              required
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. RELIANCE.NS, AAPL"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 uppercase"
            />
            <p className="text-xs text-muted-foreground mt-1">Use .NS suffix for Indian Stocks (e.g. TCS.NS)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Quantity</label>
              <input
                type="number"
                required
                min="0.0001"
                step="any"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Price per Share</label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-all shadow-lg flex justify-center items-center gap-2 mt-6 ${isBuy ? 'bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/40' : 'bg-destructive hover:bg-destructive/90 shadow-destructive/20 hover:shadow-destructive/40'} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isBuy ? 'Submit Buy Order' : 'Submit Sell Order')}
          </button>
        </form>
      </div>
    </div>
  );
}
