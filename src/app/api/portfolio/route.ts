import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all portfolio holdings
export async function GET() {
  const { data, error } = await supabase
    .from('portfolio_holdings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Add a new holding transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticker, quantity, average_price, is_buy } = body;

    if (!ticker || !quantity || !average_price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('portfolio_holdings')
      .insert([
        { ticker: ticker.toUpperCase(), quantity, average_price, is_buy }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Delete a holding transaction by id
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing transaction id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('portfolio_holdings')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
