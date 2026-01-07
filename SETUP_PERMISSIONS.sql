-- ============================================
-- SUPABASE PERMISSIONS SETUP
-- Run these in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. DATABASE TABLE POLICIES (RLS)
-- ============================================

-- Enable Row Level Security on artworks table
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Allow public to read (SELECT) artworks
CREATE POLICY "Public read access" ON artworks
  FOR SELECT USING (true);

-- Allow public to insert new artworks
CREATE POLICY "Public insert access" ON artworks
  FOR INSERT WITH CHECK (true);

-- Allow public to update artworks
CREATE POLICY "Public update access" ON artworks
  FOR UPDATE USING (true);

-- Allow public to delete artworks
CREATE POLICY "Public delete access" ON artworks
  FOR DELETE USING (true);

-- ============================================
-- 2. STORAGE BUCKET POLICIES
-- ============================================

-- Allow public to read (SELECT) images from artworks bucket
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

-- Allow public to upload (INSERT) images to artworks bucket
CREATE POLICY "Public upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks');

-- Allow public to update images in artworks bucket
CREATE POLICY "Public update access" ON storage.objects
  FOR UPDATE USING (bucket_id = 'artworks');

-- Allow public to delete images from artworks bucket
CREATE POLICY "Public delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'artworks');

-- ============================================
-- DONE!
-- ============================================
-- After running this:
-- 1. Your admin panel should be able to upload images
-- 2. Your admin panel should be able to add/edit/delete artworks
-- 3. Your website should be able to read artworks
-- ============================================

