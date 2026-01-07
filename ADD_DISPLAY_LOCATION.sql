-- Add display_location column to artworks table
-- Run this in Supabase SQL Editor

ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS display_location TEXT DEFAULT 'all' CHECK (display_location IN ('homepage', 'gallery', 'shop', 'all', 'none'));

-- Update existing artworks to have 'all' as default
UPDATE artworks SET display_location = 'all' WHERE display_location IS NULL;

