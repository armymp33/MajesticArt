-- Add product_variants column to artworks table
-- Run this in Supabase SQL Editor

-- Add product_variants column as JSONB to store product type, size, image, and price mappings
ALTER TABLE artworks 
ADD COLUMN IF NOT EXISTS product_variants JSONB DEFAULT '[]'::jsonb;

-- Create an index on product_variants for better query performance
CREATE INDEX IF NOT EXISTS idx_artworks_product_variants ON artworks USING GIN (product_variants);

-- Example structure of product_variants:
-- [
--   {
--     "productTypeId": "canvas",
--     "size": "12\" x 16\"",
--     "image": "https://...",
--     "price": 95
--   },
--   {
--     "productTypeId": "canvas",
--     "size": "18\" x 24\"",
--     "image": "https://...",
--     "price": 165
--   }
-- ]

