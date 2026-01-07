-- Create newsletter_subscribers table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for newsletter signup)
CREATE POLICY "Allow newsletter signup" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy: Allow public to read (optional - for admin to view subscribers)
CREATE POLICY "Allow public read" ON newsletter_subscribers
  FOR SELECT USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(active);

