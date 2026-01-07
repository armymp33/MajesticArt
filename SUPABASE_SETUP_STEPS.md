# Supabase Setup - Step by Step Guide

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API** in the settings menu
5. You'll see:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

**Copy both of these - you'll need them!**

## Step 2: Update Your Code with New Credentials

Once you have your credentials, I'll help you update `src/lib/supabase.ts` with your new project URL and key.

## Step 3: Create the Artworks Table

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste this SQL code:

```sql
-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('paintings', 'digital', 'mixed-media')),
  image TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  year INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so customers can view artworks)
CREATE POLICY "Public read access" ON artworks
  FOR SELECT USING (true);

-- Allow anyone to insert/update/delete (for admin panel)
-- Note: In production, you'd want to restrict this to authenticated users
CREATE POLICY "Public write access" ON artworks
  FOR ALL USING (true);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 4: Create Storage Bucket for Images

1. In your Supabase dashboard, click on **Storage** in the left sidebar
2. Click **New bucket** button
3. Fill in:
   - **Name**: `artworks` (must be exactly this)
   - **Public bucket**: Toggle this ON (so images can be accessed)
4. Click **Create bucket**

## Step 5: Set Storage Policies

1. Still in Storage, click on the **artworks** bucket you just created
2. Click on **Policies** tab
3. Click **New policy**
4. Select **For full customization**
5. Name it: `Public read access`
6. Copy and paste this SQL:

```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');
```

7. Click **Review** then **Save policy**

8. Create another policy for uploads:
   - Click **New policy** again
   - Select **For full customization**
   - Name it: `Public upload access`
   - Copy and paste this SQL:

```sql
-- Allow public uploads (for admin panel)
CREATE POLICY "Public upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'artworks');
```

9. Click **Review** then **Save policy**

## Step 6: Test It!

1. Go to your admin panel: `http://localhost:8080/admin/login`
2. Login with password: `majestic2024`
3. Try adding a test artwork with an image

## ✅ You're Done!

Once you complete these steps, your admin panel will be fully functional!

---

## Need Help?

If you get any errors:
- Make sure the table name is exactly `artworks`
- Make sure the bucket name is exactly `artworks`
- Make sure the bucket is set to **Public**
- Check that your Supabase credentials are correct in `src/lib/supabase.ts`

