import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const period = searchParams.get('period') || '1y';

  if (!ticker) {
    return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
  }

  try {
    // Map period string to yahoo-finance2 chart params
    const periodMap: Record<string, string> = {
      '1m': '1mo',
      '3m': '3mo',
      '6m': '6mo',
      '1y': '1y',
      '2y': '2y',
      '5y': '5y',
    };

    const result = await yahooFinance.chart(ticker, {
      period1: getStartDate(period),
      interval: period === '1m' ? '1d' : period === '5y' ? '1wk' : '1d',
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return NextResponse.json({ error: 'No data available' }, { status: 404 });
    }

    const quotes = result.quotes
      .filter((q: any) => q.close !== null && q.close !== undefined)
      .map((q: any) => ({
        date: new Date(q.date).toISOString().split('T')[0],
        open: q.open || 0,
        high: q.high || 0,
        low: q.low || 0,
        close: q.close || 0,
        volume: q.volume || 0,
      }));

    // Calculate moving averages server-side
    const closes = quotes.map((q: any) => q.close);
    const sma50 = calculateSMAServer(closes, 50);
    const sma200 = calculateSMAServer(closes, 200);

    return NextResponse.json({
      ticker,
      quotes,
      sma50,
      sma200,
      meta: {
        currency: result.meta?.currency || 'INR',
        symbol: result.meta?.symbol || ticker,
        name: result.meta?.longName || result.meta?.shortName || ticker,
      },
    });
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}

function getStartDate(period: string): string {
  const now = new Date();
  const map: Record<string, number> = {
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825,
  };
  const days = map[period] || 365;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return start.toISOString().split('T')[0];
}

function calculateSMAServer(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      sma.push(Number((slice.reduce((a: number, b: number) => a + b, 0) / period).toFixed(2)));
    }
  }
  return sma;
}
