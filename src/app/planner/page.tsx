'use client';

import { useState, useMemo } from 'react';
import { Calculator, PiggyBank, BadgeDollarSign, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { calculateSIP, calculateFD, getAllocationSuggestion } from '@/lib/analysis';

const ALLOC_COLORS = { equity: '#3b82f6', debt: '#10b981', gold: '#f59e0b', liquid: '#8b5cf6' };

export default function PlannerPage() {
  // SIP Calculator state
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // FD Calculator state
  const [fdAmount, setFdAmount] = useState(100000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYears, setFdYears] = useState(5);

  // Risk Profile
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  // Calculations
  const sipResult = useMemo(() => calculateSIP(sipAmount, sipReturn, sipYears), [sipAmount, sipReturn, sipYears]);
  const fdResult = useMemo(() => calculateFD(fdAmount, fdRate, fdYears), [fdAmount, fdRate, fdYears]);
  const equityResult = useMemo(() => {
    const equityReturn = 12;
    const fv = fdAmount * Math.pow(1 + equityReturn / 100, fdYears);
    return { futureValue: Math.round(fv), returnPercent: equityReturn };
  }, [fdAmount, fdYears]);
  const allocation = useMemo(() => getAllocationSuggestion(riskProfile), [riskProfile]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const allocChartData = [
    { name: 'Equity', value: allocation.equity },
    { name: 'Debt', value: allocation.debt },
    { name: 'Gold', value: allocation.gold },
    { name: 'Liquid', value: allocation.liquid },
  ];

  const riskProfiles = [
    { id: 'conservative' as const, label: 'Conservative', icon: Shield, desc: 'Capital safety first' },
    { id: 'balanced' as const, label: 'Balanced', icon: Target, desc: 'Growth with stability' },
    { id: 'aggressive' as const, label: 'Aggressive', icon: Zap, desc: 'Maximum growth' },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 flex items-center gap-3">
            <Calculator className="text-primary" size={32} />
            Smart Money Planner
          </h1>
          <p className="text-muted-foreground mt-2">
            SIP calculator, FD comparison, and personalized asset allocation advice.
          </p>
        </div>

        {/* Risk Profile Selector */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            Your Risk Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {riskProfiles.map(rp => {
              const Icon = rp.icon;
              const isActive = riskProfile === rp.id;
              return (
                <button
                  key={rp.id}
                  onClick={() => setRiskProfile(rp.id)}
                  className={`p-4 rounded-xl text-left transition-all border ${isActive
                    ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
                    <span className={`font-semibold ${isActive ? 'text-primary' : 'text-white/80'}`}>{rp.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rp.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Allocation Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-white/70 mb-3">Recommended Allocation</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {allocChartData.map((entry) => (
                        <Cell key={entry.name} fill={ALLOC_COLORS[entry.name.toLowerCase() as keyof typeof ALLOC_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(val: any) => `${val}%`}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {allocChartData.map(a => (
                  <div key={a.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ALLOC_COLORS[a.name.toLowerCase() as keyof typeof ALLOC_COLORS] }} />
                    <span className="text-muted-foreground">{a.name} {a.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/70 mb-3">{allocation.label} Strategy</h3>
              <p className="text-sm text-muted-foreground mb-4">{allocation.description}</p>
              <div className="space-y-2">
                {allocation.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-white/70">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SIP Calculator */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <PiggyBank size={20} className="text-emerald-500" />
              SIP Calculator
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-muted-foreground">Monthly Investment</label>
                  <span className="text-white/90 font-medium">{formatCurrency(sipAmount)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={sipAmount}
                  onChange={e => setSipAmount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-white/10 rounded-full cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-muted-foreground">Expected Return (%/yr)</label>
                  <span className="text-white/90 font-medium">{sipReturn}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="25"
                  step="0.5"
                  value={sipReturn}
                  onChange={e => setSipReturn(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-white/10 rounded-full cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-muted-foreground">Time Period</label>
                  <span className="text-white/90 font-medium">{sipYears} years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={sipYears}
                  onChange={e => setSipYears(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-white/10 rounded-full cursor-pointer"
                />
              </div>
            </div>

            {/* SIP Results */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xs text-muted-foreground">Invested</div>
                <div className="text-sm font-bold text-white/90">{formatCurrency(sipResult.totalInvested)}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xs text-muted-foreground">Returns</div>
                <div className="text-sm font-bold text-emerald-500">{formatCurrency(sipResult.wealthGained)}</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xs text-muted-foreground">Total Value</div>
                <div className="text-sm font-bold text-primary">{formatCurrency(sipResult.futureValue)}</div>
              </div>
            </div>

            {/* SIP Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sipResult.monthlyData}>
                  <defs>
                    <linearGradient id="sipInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sipValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="invested" name="Invested" stroke="#3b82f6" fill="url(#sipInvested)" strokeWidth={2} />
                  <Area type="monotone" dataKey="value" name="Value" stroke="#10b981" fill="url(#sipValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-muted-foreground">Your money grows </span>
              <span className="text-sm font-bold text-primary">{sipResult.returnMultiple}x</span>
              <span className="text-xs text-muted-foreground"> in {sipYears} years</span>
            </div>
          </div>

          {/* FD vs Equity Comparison */}
          <div className="glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
              <BadgeDollarSign size={20} className="text-amber-500" />
              FD vs Equity Comparison
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-muted-foreground">Investment Amount</label>
                  <span className="text-white/90 font-medium">{formatCurrency(fdAmount)}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={fdAmount}
                  onChange={e => setFdAmount(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-white/10 rounded-full cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="text-muted-foreground">FD Rate</label>
                    <span className="text-white/90 font-medium">{fdRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="0.25"
                    value={fdRate}
                    onChange={e => setFdRate(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-white/10 rounded-full cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="text-muted-foreground">Period</label>
                    <span className="text-white/90 font-medium">{fdYears} years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={fdYears}
                    onChange={e => setFdYears(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-white/10 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground">
                    <th className="pb-3 text-left font-medium">Metric</th>
                    <th className="pb-3 text-right font-medium">🏦 Fixed Deposit</th>
                    <th className="pb-3 text-right font-medium">📈 Equity (Nifty 50)</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Principal</td>
                    <td className="py-3 text-right">{formatCurrency(fdAmount)}</td>
                    <td className="py-3 text-right">{formatCurrency(fdAmount)}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Return Rate</td>
                    <td className="py-3 text-right">{fdRate}% p.a.</td>
                    <td className="py-3 text-right text-emerald-500">~12% p.a.</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Maturity Value</td>
                    <td className="py-3 text-right">{formatCurrency(fdResult.maturityAmount)}</td>
                    <td className="py-3 text-right text-emerald-500 font-semibold">{formatCurrency(equityResult.futureValue)}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Gains</td>
                    <td className="py-3 text-right">{formatCurrency(fdResult.interestEarned)}</td>
                    <td className="py-3 text-right text-emerald-500">{formatCurrency(equityResult.futureValue - fdAmount)}</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Tax</td>
                    <td className="py-3 text-right text-red-400">Income tax slab</td>
                    <td className="py-3 text-right text-emerald-500">10% LTCG (₹1L exempt)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 text-muted-foreground">Risk</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-500">Very Low</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500">Moderate</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-muted-foreground">Liquidity</td>
                    <td className="py-3 text-right text-amber-500">Penalty on early exit</td>
                    <td className="py-3 text-right text-emerald-500">Sell anytime</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Verdict */}
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <TrendingUp size={18} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-white/80 font-medium">
                    Equity generates {formatCurrency(equityResult.futureValue - fdResult.maturityAmount)} MORE than FD over {fdYears} years
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    However, equity carries market risk. FDs are guaranteed. Use FDs for short-term goals (under 3 years) and equity for long-term wealth creation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground/60 py-4 max-w-2xl mx-auto">
          ⚠️ All calculations are indicative and based on assumed returns. Actual returns may vary.
          Past performance does not guarantee future results.
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-0" />
    </div>
  );
}
