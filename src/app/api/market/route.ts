import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers');

  if (!tickers) {
    return NextResponse.json({ error: 'No tickers provided' }, { status: 400 });
  }

  const tickerArray = tickers.split(',').map(t => t.trim());

  try {
    const results = await Promise.all(
      tickerArray.map(async (ticker) => {
        try {
          const quote: any = await yahooFinance.quote(ticker);
          return {
            ticker,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            currency: quote.currency,
            name: quote.longName || quote.shortName || ticker,
          };
        } catch (error) {
          console.error(`Error fetching ${ticker}:`, error);
          return {
            ticker,
            error: 'Failed to fetch data',
          };
        }
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
