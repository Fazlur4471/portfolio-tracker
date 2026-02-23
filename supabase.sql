-- Run this in your Supabase SQL Editor to create the tables

-- Create a table for portfolio holdings/transactions
create table public.portfolio_holdings (
  id uuid default gen_random_uuid() primary key,
  ticker text not null,       -- e.g., 'RELIANCE.NS' or 'AAPL'
  quantity numeric not null,  -- Number of shares
  average_price numeric not null, -- Price per share
  is_buy boolean default true, -- True for Buy, false for Sell
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) but we'll allow anon access for local dev
alter table public.portfolio_holdings enable row level security;

-- Policy to allow anonymous access (since this is personal / local MVP)
create policy "Allow anonymous read" on public.portfolio_holdings for select using (true);
create policy "Allow anonymous insert" on public.portfolio_holdings for insert with check (true);
create policy "Allow anonymous update" on public.portfolio_holdings for update using (true);
create policy "Allow anonymous delete" on public.portfolio_holdings for delete using (true);
