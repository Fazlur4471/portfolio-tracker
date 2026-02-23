// Curated Finance Lessons Library — Indian Context

export type Lesson = {
  id: string;
  title: string;
  category: 'basics' | 'stocks' | 'mutual-funds' | 'tax' | 'strategy';
  emoji: string;
  summary: string;
  content: string;
  example: string;
  takeaway: string;
};

export const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📚' },
  { id: 'basics', label: 'Basics', emoji: '🧱' },
  { id: 'stocks', label: 'Stocks', emoji: '📈' },
  { id: 'mutual-funds', label: 'Mutual Funds', emoji: '🏦' },
  { id: 'tax', label: 'Tax', emoji: '🧾' },
  { id: 'strategy', label: 'Strategy', emoji: '🎯' },
];

export const LESSONS: Lesson[] = [
  // ===== BASICS =====
  {
    id: 'what-is-stock',
    title: 'What is a Stock?',
    category: 'basics',
    emoji: '🏢',
    summary: 'Understanding equity ownership in a company.',
    content: `When you buy a stock (also called a share or equity), you become a part-owner of that company. If the company does well and grows its profits, the value of your ownership (the stock price) typically increases.

Stocks are traded on exchanges like the NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) in India. The NSE\'s primary index is the Nifty 50, which tracks the top 50 companies by market capitalization.

You can buy and sell stocks through a Demat account with brokers like Zerodha, Groww, or Angel One. The minimum you can buy is 1 share.`,
    example: `If you bought 10 shares of Reliance Industries at ₹2,000 each, you invested ₹20,000. If the stock price rises to ₹2,500, your investment is now worth ₹25,000 — a profit of ₹5,000 (25% return).`,
    takeaway: 'Stocks represent ownership in a company. When the company grows, so does your wealth.',
  },
  {
    id: 'power-of-compounding',
    title: 'The Power of Compounding',
    category: 'basics',
    emoji: '🚀',
    summary: 'How your money grows exponentially over time.',
    content: `Compounding is earning returns not just on your original investment, but also on the returns already earned. Albert Einstein reportedly called it the "eighth wonder of the world."

The magic of compounding becomes visible over long periods. The earlier you start investing, the more powerful compounding becomes. This is why starting a SIP at age 25 vs 35 can result in dramatically different wealth at retirement.

The formula is simple: Future Value = Present Value × (1 + rate)^years. The key variable is TIME — the longer your money compounds, the bigger it grows.`,
    example: `₹10,000 invested at 12% annual return:
• After 10 years: ₹31,058
• After 20 years: ₹96,463
• After 30 years: ₹2,99,599

The same ₹10,000 grows 3x in the first 10 years but nearly 10x in the next 20 years. That's compounding at work!`,
    takeaway: 'Start investing early. Even small amounts grow massively over decades due to compounding.',
  },
  {
    id: 'inflation-real-returns',
    title: 'Inflation & Real Returns',
    category: 'basics',
    emoji: '📉',
    summary: 'Why your money loses value if it just sits in a savings account.',
    content: `Inflation is the rate at which prices of goods and services increase over time. In India, inflation averages around 5-7% per year. This means ₹100 today will buy less next year.

Your "real return" is the return AFTER subtracting inflation. If your FD earns 7% and inflation is 6%, your real return is only about 1%. This is why keeping all your money in a savings account (3.5-4% interest) actually makes you poorer in real terms.

To beat inflation consistently, you need growth-oriented investments like equity, which historically returns 12-15% in India.`,
    example: `If you kept ₹1,00,000 in a savings account earning 4% for 10 years, you\'d have ₹1,48,024. But with inflation at 6%, the purchasing power of ₹1,48,024 would be equivalent to only ₹82,635 in today\'s money. You actually lost value!

Compare this to investing in Nifty 50 index at ~12% return: ₹1,00,000 becomes ₹3,10,585 — beating inflation comfortably.`,
    takeaway: 'Always think in terms of returns AFTER inflation. Equity is the most reliable way to beat inflation long-term.',
  },
  {
    id: 'emergency-fund',
    title: 'The Emergency Fund',
    category: 'basics',
    emoji: '🛡️',
    summary: 'Your financial safety net before you start investing.',
    content: `Before investing in stocks or mutual funds, build an emergency fund covering 3-6 months of your monthly expenses. This fund should be in a highly liquid, safe place like a savings account or liquid mutual fund.

The purpose is to protect you from unexpected expenses (medical emergencies, job loss) without having to sell your investments at a bad time. Markets can drop 20-30% in a crash — you don't want to be forced to sell at a loss because you need cash.

Only after your emergency fund is in place should you begin investing in equity for wealth creation.`,
    example: `If your monthly expenses are ₹30,000, your emergency fund should be ₹90,000 to ₹1,80,000. Keep this in:
• Savings account (instant access, ~4% interest)
• Liquid mutual fund (1-day withdrawal, ~6% return)
• Split between both for balance of access and returns`,
    takeaway: 'Build 3-6 months of expenses as an emergency fund BEFORE investing. This is your financial foundation.',
  },
  // ===== STOCKS =====
  {
    id: 'pe-ratio',
    title: 'Understanding P/E Ratio',
    category: 'stocks',
    emoji: '🔍',
    summary: 'The most popular metric to evaluate if a stock is expensive or cheap.',
    content: `The Price-to-Earnings (P/E) ratio tells you how much investors are willing to pay for ₹1 of a company\'s earnings. It's calculated as: P/E = Stock Price / Earnings Per Share (EPS).

A high P/E (say 50+) means investors expect high future growth — they're paying a premium. A low P/E (say 10-15) might mean the stock is undervalued or the market doesn't expect much growth.

Compare P/E ratios within the same industry. An IT company's P/E of 30 might be reasonable, while a bank at P/E 30 might be expensive since banks typically trade at lower P/Es.`,
    example: `TCS trades at P/E ~28, while SBI trades at P/E ~8. Does this mean SBI is cheaper? Not necessarily — IT companies typically command higher P/Es due to higher growth expectations. But within banking, if HDFC Bank is at P/E 20 and SBI is at P/E 8, SBI might be relatively undervalued.`,
    takeaway: 'P/E ratio is a quick valuation check. Compare within the same industry, not across different sectors.',
  },
  {
    id: 'market-cap',
    title: 'Market Cap Explained',
    category: 'stocks',
    emoji: '📊',
    summary: 'Understanding company sizes: Large-cap, Mid-cap, and Small-cap.',
    content: `Market capitalization (market cap) = Stock Price × Total Number of Shares. It tells you the total value of a company as determined by the stock market.

In India, SEBI classifies companies as:
• Large-cap: Top 100 companies (e.g., Reliance, TCS, HDFC Bank) — more stable, lower risk
• Mid-cap: Companies ranked 101-250 — moderate growth with moderate risk
• Small-cap: Companies ranked 251+ — high growth potential but also high risk and volatility

A balanced portfolio typically has a mix of all three, weighted towards large-caps for stability.`,
    example: `Reliance Industries has a market cap of ~₹18 lakh crore — it's the largest company in India. A mid-cap like Persistent Systems might be around ₹50,000 crore, while a small-cap could be ₹5,000 crore.

Large-caps fell ~15% in COVID crash but recovered within months. Some small-caps fell 50-70% and took years to recover.`,
    takeaway: 'Large-caps for stability, mid-caps for growth, small-caps for high-risk/high-reward. Diversify across all three.',
  },
  {
    id: 'nifty-sensex',
    title: 'Nifty 50 & Sensex Explained',
    category: 'stocks',
    emoji: '🏛️',
    summary: 'India\'s benchmark stock market indices and why they matter.',
    content: `Nifty 50 is an index of the top 50 companies listed on the NSE, managed by NSE Indices Ltd. Sensex is the BSE's index of 30 top companies. Both serve as barometers for the Indian stock market.

When people say "the market went up 2% today," they usually mean the Nifty 50 or Sensex moved up 2%. These indices are used to measure how your portfolio performs relative to the overall market.

You can invest directly in these indices through index funds or ETFs (like Nifty BeES) at very low cost, typically 0.1-0.2% expense ratio.`,
    example: `Nifty 50 was at ~1,000 in 2002. In 2024, it's around 22,000. That's a ~22x return in 22 years, roughly 15% CAGR. An investor who simply bought a Nifty 50 index fund through SIP and held it would have built massive wealth with zero stock-picking effort.`,
    takeaway: 'Index funds tracking Nifty 50 or Sensex are the simplest, cheapest way to grow wealth in Indian equities.',
  },
  {
    id: 'ipo-basics',
    title: 'IPO Basics: Should You Apply?',
    category: 'stocks',
    emoji: '🎟️',
    summary: 'Understanding Initial Public Offerings and the listing day hype.',
    content: `An IPO (Initial Public Offering) is when a private company sells its shares to the public for the first time. You can apply through your Demat account via ASBA (your money stays in your bank until allotment).

IPOs are popular in India because of potential listing-day gains. However, not all IPOs are good investments. Some are overpriced by the company to raise maximum money. Always check:
• Company's financial health (profitable or burning cash?)
• Valuation compared to listed peers
• Grey Market Premium (GMP) for sentiment indication

Long-term, only invest in IPOs you'd hold for years, not just for listing gains.`,
    example: `Zomato IPO (2021): Listed at 53% premium but then fell 60% from its highs within a year. LIC IPO (2022): Listed at a discount and fell further. However, Tata Technologies IPO (2023): Listed at 140% premium AND held its value. Research before applying!`,
    takeaway: 'Don\'t blindly apply to every IPO. Evaluate the company like any other investment. Listing gains are never guaranteed.',
  },
  // ===== MUTUAL FUNDS =====
  {
    id: 'sip-vs-lumpsum',
    title: 'SIP vs Lumpsum Investing',
    category: 'mutual-funds',
    emoji: '💧',
    summary: 'Systematic investment vs one-time investment — which is better?',
    content: `SIP (Systematic Investment Plan) means investing a fixed amount regularly (monthly). Lumpsum means investing a large amount at once. Both have their place.

SIP benefits:
• Rupee cost averaging: You buy more units when prices are low, fewer when high
• Disciplined investing: Automatic, removes emotional decision-making
• Lower risk: Spreads your entry points over time

Lumpsum benefits:
• If market has already fallen significantly, lumpsum can capture the bottom
• Over very long periods, lumpsum invested early has more time to compound

For most salaried individuals, SIP is the way to go because it matches your monthly income flow.`,
    example: `₹10,000/month SIP in Nifty 50 index fund for 15 years at 12% returns:
• Total invested: ₹18,00,000
• Expected value: ₹50,45,760
• Wealth gain: ₹32,45,760

But ₹18,00,000 lumpsum invested at the same time for 15 years at 12%:
• Expected value: ₹98,52,722

Lumpsum wins IF you have all the money upfront and time the market right. SIP wins for consistency and peace of mind.`,
    takeaway: 'SIP is ideal for regular income earners. Lumpsum is better when you have a large corpus and the market is undervalued.',
  },
  {
    id: 'expense-ratio',
    title: 'Expense Ratio: The Silent Wealth Killer',
    category: 'mutual-funds',
    emoji: '💸',
    summary: 'How fund management fees eat into your returns over time.',
    content: `Expense ratio is the annual fee charged by a mutual fund for managing your money. It's deducted from the fund's NAV daily, so you never "see" it being charged — but it significantly impacts your returns.

Active funds charge 1-2.5% expense ratio. Index funds charge 0.1-0.5%. Over 20-30 years, this difference compounds massively.

A seemingly small 1.5% difference in expense ratio can cost you 25-30% of your total wealth over 25 years. This is why the shift towards low-cost index funds is one of the most important trends in personal finance.`,
    example: `₹10,000/month SIP for 25 years:
• At 12% return (active fund, 1.5% expense ratio → net 10.5%): ₹1.33 crore
• At 12% return (index fund, 0.2% expense ratio → net 11.8%): ₹1.68 crore

Difference: ₹35 lakh! That's the cost of the higher expense ratio. And most active funds don't even beat the index consistently.`,
    takeaway: 'Choose funds with low expense ratios. Index funds often outperform active funds AFTER accounting for fees.',
  },
  {
    id: 'index-vs-active',
    title: 'Index Funds vs Active Funds',
    category: 'mutual-funds',
    emoji: '⚖️',
    summary: 'Why most professional fund managers fail to beat the market.',
    content: `Index funds simply replicate an index (like Nifty 50) — no fund manager is picking stocks. Active funds employ star fund managers who try to beat the index by selecting "winning" stocks.

The data is clear: over a 10-year period, 80-90% of active large-cap funds FAIL to beat the Nifty 50 index in India. The few that do beat it in one period often underperform in the next.

This doesn't mean all active funds are bad. In the mid-cap and small-cap space, active management can add value because these stocks are less efficiently priced. But for large-cap exposure, index funds are the smart choice.`,
    example: `The Nifty 50 Total Return Index delivered ~12.5% CAGR over the last 15 years. Many popular large-cap mutual funds delivered 10-11% CAGR after expenses. The "experts" actually LOST you money compared to a simple, cheap index fund!

Top index funds in India: UTI Nifty 50, HDFC Index Fund - Nifty 50, Motilal Oswal Nifty 50.`,
    takeaway: 'For large-cap exposure, use index funds. Save active management for mid-cap and small-cap where stock selection matters more.',
  },
  {
    id: 'elss-tax-saving',
    title: 'ELSS: Tax Saving with Growth',
    category: 'mutual-funds',
    emoji: '🏷️',
    summary: 'Save tax under Section 80C while growing your wealth.',
    content: `ELSS (Equity Linked Savings Scheme) is a type of mutual fund that gives you tax deduction under Section 80C of up to ₹1,50,000 per year. It has the shortest lock-in period among 80C instruments — just 3 years.

Compare with: PPF (15-year lock-in), NSC (5-year lock-in), Tax-saving FD (5-year lock-in). ELSS gives you equity-like returns (12-15% historically) with the shortest lock-in.

You can invest via SIP (recommended) or lumpsum. After the 3-year lock-in, gains above ₹1 lakh are taxed as LTCG at 10%.`,
    example: `If you invest ₹1,50,000 in ELSS:
• Tax saved (30% bracket): ₹46,800
• If ELSS grows at 12% for 3 years: ₹1,50,000 → ₹2,10,743
• Net gain: ₹60,743 capital appreciation + ₹46,800 tax saved = ₹1,07,543 effective gain

That's a 71% total return in 3 years including the tax benefit!`,
    takeaway: 'ELSS is the best 80C investment for wealth creation — shortest lock-in with highest return potential.',
  },
  // ===== TAX =====
  {
    id: 'section-80c',
    title: 'Section 80C: Your Tax-Saving Toolkit',
    category: 'tax',
    emoji: '🧾',
    summary: 'Save up to ₹46,800 in taxes every year with these investments.',
    content: `Section 80C allows deductions of up to ₹1,50,000 from your taxable income. If you're in the 30% tax bracket, this saves you ₹46,800 per year.

Popular 80C investments ranked by returns:
1. ELSS Mutual Funds: ~12-15% returns, 3-year lock-in
2. PPF: 7.1% returns, 15-year lock-in, tax-free returns
3. NPS: Market-linked, additional ₹50,000 under 80CCD(1B)
4. EPF: 8.15% returns, until retirement
5. Tax-saving FD: ~7% returns, 5-year lock-in

Note: The new tax regime (introduced 2023) does NOT allow 80C deductions. Choose your regime wisely based on total deductions.`,
    example: `For someone earning ₹10,00,000/year in the old regime:
• Without 80C: Taxable income = ₹10,00,000, Tax = ~₹1,12,500
• With 80C (₹1,50,000 in ELSS): Taxable income = ₹8,50,000, Tax = ~₹65,000
• Annual savings: ₹47,500

Over 20 years, investing this ₹47,500 tax saved back into the market at 12% = ₹36 lakh of additional wealth!`,
    takeaway: 'Max out your ₹1,50,000 limit every year. Prefer ELSS for growth or PPF for guaranteed returns.',
  },
  {
    id: 'ltcg-stcg',
    title: 'LTCG vs STCG: Stock Market Taxation',
    category: 'tax',
    emoji: '⏰',
    summary: 'How long you hold a stock determines how much tax you pay.',
    content: `In India, stock market gains are taxed based on holding period:

Short-Term Capital Gains (STCG): Stocks/equity funds held for LESS than 1 year → Taxed at 15%
Long-Term Capital Gains (LTCG): Stocks/equity funds held for MORE than 1 year → Taxed at 10% on gains exceeding ₹1 lakh per year

This is a major incentive to hold stocks for the long term. Not only do you benefit from compounding, but your tax rate drops from 15% to 10% (with a ₹1 lakh exemption).

For debt mutual funds (post April 2023), gains are added to your income and taxed at your slab rate regardless of holding period.`,
    example: `You bought 100 shares of TCS at ₹3,000 (₹3,00,000 invested) and sold at ₹4,000 (₹4,00,000).

If sold within 1 year (STCG): Tax = 15% of ₹1,00,000 = ₹15,000
If sold after 1 year (LTCG): First ₹1L exempt, tax = 10% of ₹0 = ₹0!

By simply waiting a few more months, you saved ₹15,000 in taxes.`,
    takeaway: 'Hold equity investments for over 1 year to benefit from lower LTCG taxation and the ₹1 lakh annual exemption.',
  },
  {
    id: 'dividend-tax',
    title: 'How Dividends Are Taxed',
    category: 'tax',
    emoji: '💰',
    summary: 'Dividends are not tax-free anymore — here\'s what changed.',
    content: `Since April 2020, dividends from stocks and mutual funds are taxed at your income tax slab rate. Before this, companies paid DDT (Dividend Distribution Tax) and dividends were tax-free in your hands.

This means if you're in the 30% tax bracket, a ₹10,000 dividend effectively gives you only ₹7,000 after tax. Additionally, if your total dividend income exceeds ₹5,000, 10% TDS is deducted at source.

For tax efficiency, growth-oriented investments (where returns come from price appreciation, not dividends) are generally better than dividend-paying stocks, especially for high-income earners.`,
    example: `Company A pays ₹50,000 in annual dividends. If you're in the 30% bracket:
• Tax on dividends: ₹15,000 + cess
• Net dividend income: ~₹34,500

Instead, if the company reinvested that money and the stock price grew by ₹50,000:
• No tax until you sell
• If held >1 year: ₹0 tax (within ₹1L LTCG exemption)

Growth stocks are more tax-efficient than dividend stocks for high-income individuals.`,
    takeaway: 'Dividends are taxed at your slab rate. For tax efficiency, prefer growth-oriented investments over dividend-heavy ones.',
  },
  // ===== STRATEGY =====
  {
    id: 'rupee-cost-averaging',
    title: 'Rupee Cost Averaging',
    category: 'strategy',
    emoji: '📐',
    summary: 'How SIP automatically buys more when markets fall.',
    content: `Rupee Cost Averaging (RCA) is the automatic benefit of SIP investing. Since you invest a fixed amount every month, you buy MORE units when prices are low and FEWER units when prices are high.

Over time, this averages out your purchase cost, reducing the impact of market volatility. You end up with a lower average cost per unit than if you'd bought at random times.

This is especially powerful during market corrections. When everyone else is panicking, your SIP is silently buying more units at cheaper prices — setting you up for bigger gains when markets recover.`,
    example: `₹5,000 SIP example:
• Month 1: NAV = ₹100, bought 50 units
• Month 2: NAV = ₹80 (market falls), bought 62.5 units
• Month 3: NAV = ₹90, bought 55.5 units

Total invested: ₹15,000 | Total units: 168 | Average cost: ₹89.3/unit

If you had put ₹15,000 lumpsum in Month 1 at NAV 100, you'd have only 150 units. SIP gave you 18 extra units due to the dip!`,
    takeaway: 'Never stop your SIP during market falls — that\'s when it works hardest for you. Continue SIPs for at least 7-10 years.',
  },
  {
    id: 'asset-allocation',
    title: 'Asset Allocation: The Only Free Lunch',
    category: 'strategy',
    emoji: '🍰',
    summary: 'How splitting money across asset classes reduces risk without reducing returns.',
    content: `Asset allocation means dividing your investments across different asset classes: equity (stocks), debt (bonds/FDs), gold, and real estate. The principle is that different assets perform well at different times.

A classic allocation rule of thumb: "100 minus your age" goes into equity. So a 30-year-old would put 70% in equity and 30% in debt/gold. But this is just a starting point — your risk tolerance and goals matter more.

The key benefit: when stocks crash, gold often rises. When interest rates fall (hurting FD returns), stocks often rally. This natural balancing act reduces portfolio volatility while maintaining solid long-term returns.`,
    example: `In the 2020 COVID crash:
• Stocks (Nifty 50): Fell 38%
• Gold: Rose 28%
• Debt funds: Stable at 6-8%

A portfolio with 60% equity + 20% gold + 20% debt would have fallen only ~15% instead of 38%. And the rebalancing opportunity (selling gold to buy more stocks) would have amplified recovery gains.`,
    takeaway: 'Don\'t put all eggs in one basket. A mix of equity, debt, and gold smooths your ride while maintaining growth.',
  },
  {
    id: 'when-to-book-profits',
    title: 'When to Book Profits',
    category: 'strategy',
    emoji: '🎯',
    summary: 'Rules for taking money off the table without leaving gains behind.',
    content: `One of the hardest decisions in investing is when to sell. Here are some practical frameworks:

1. Goal-based selling: If your investment was for a specific goal (house down payment, child's education), sell when you reach your target amount, regardless of market conditions.

2. Rebalancing: If one stock grows to become >30% of your portfolio, trim it back to your target allocation. This is systematic, not emotional.

3. Fundamental change: Sell if the reason you bought has changed (management fraud, industry disruption, persistent losses).

4. Valuation stretch: If a stock's P/E is 2-3x its historical average without corresponding earnings growth, consider trimming.

Never sell just because: "the market is high" or "I'm scared." These are emotional, not rational, decisions.`,
    example: `You bought ITC at ₹200 for its dividend yield story. It rises to ₹450 with a P/E of 28 (vs historical average of 18). This is a legitimate reason to trim — not because you're scared, but because the valuation is stretched relative to its history.

But if TCS rises from ₹3,000 to ₹4,000 with earnings growing 15% annually and P/E staying at 30, there's no reason to sell — the growth justifies the price.`,
    takeaway: 'Sell based on goals, rebalancing rules, or fundamental changes — never based on fear or "it\'s too high."',
  },
  {
    id: 'risk-management',
    title: 'Risk Management for Beginners',
    category: 'strategy',
    emoji: '🛡️',
    summary: 'Protecting your capital is more important than maximizing returns.',
    content: `Risk management is the most underrated skill in investing. A 50% loss requires a 100% gain just to break even. Protecting your capital should always be priority #1.

Key rules:
1. Never invest money you'll need within 3 years into stocks
2. No single stock should be more than 10-15% of your portfolio
3. No single sector should be more than 25-30%
4. Always have a stop-loss mindset (exit if a stock falls 20-25% with deteriorating fundamentals)
5. Use SIP to reduce timing risk
6. Keep greed in check — if something sounds too good to be true, it usually is

Remember: the best investors are not those who gain the most in bull markets — they're those who lose the least in bear markets.`,
    example: `Investor A earns 50% in Year 1 but loses 40% in Year 2. Net result: ₹100 → ₹150 → ₹90. They LOST money!

Investor B earns 20% in Year 1 and loses only 10% in Year 2.
Net result: ₹100 → ₹120 → ₹108. They gained 8%.

Investor B's boring, risk-managed approach beat Investor A's exciting roller-coaster by 18 percentage points!`,
    takeaway: 'Focus on not losing money. Diversify, size positions wisely, and never invest emergency funds in stocks.',
  },
  {
    id: 'herd-mentality',
    title: 'Avoiding the Herd Mentality',
    category: 'strategy',
    emoji: '🐑',
    summary: 'Why following the crowd in markets usually leads to losses.',
    content: `Herd mentality is when investors buy or sell based on what everyone else is doing, rather than their own analysis. This creates bubbles (when everyone buys) and crashes (when everyone panics and sells).

Warren Buffett's famous advice: "Be fearful when others are greedy, and greedy when others are fearless." The best buying opportunities often come when there's blood in the streets — when everyone is selling and markets are falling.

How to avoid it: Have a written investment plan, invest via SIP (removes emotion), don't check your portfolio daily, and turn off stock market news channels during volatile periods.`,
    example: `During the 2020 COVID crash, many retail investors panic-sold when Nifty fell 38%. Those who continued their SIPs and even added extra money during the fall saw 100%+ returns over the next 2 years as Nifty doubled from its low.

The few who bought when everyone else was selling earned returns that would normally take 7-8 years — in just 2 years.`,
    takeaway: 'Market crashes are sales, not disasters. Stick to your plan, continue SIPs, and buy quality when others panic.',
  },
];

/**
 * Get the "daily" lesson based on the current date
 */
export function getDailyLesson(): Lesson {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % LESSONS.length;
  return LESSONS[index];
}
