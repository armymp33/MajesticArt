-- ============================================
-- CLEAN UP DUPLICATE STORAGE POLICIES
-- Run this to remove old/duplicate policies
-- ============================================

-- Drop all existing policies for artworks bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public inserts" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "policy_name" ON storage.objects;

-- Now create the correct policies (only 4)
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "Public upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks');

CREATE POLICY "Public update access" ON storage.objects
  FOR UPDATE USING (bucket_id = 'artworks');

CREATE POLICY "Public delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'artworks');

