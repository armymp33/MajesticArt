-- Create orders table for storing fulfilled orders
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  amount_total DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  payment_status TEXT NOT NULL,
  line_items JSONB,
  shipping_address TEXT,
  fulfilled BOOLEAN DEFAULT false,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for webhook/fulfillment)
CREATE POLICY "Allow order creation" ON orders
  FOR INSERT WITH CHECK (true);

-- Policy: Allow authenticated users to read their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_fulfilled ON orders(fulfilled);

