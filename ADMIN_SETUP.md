# Admin Panel Setup Guide

## 🎯 Overview
You now have a password-protected admin panel where you can:
- Upload new artwork images
- Add/edit/delete artwork
- Manage your gallery without customers seeing the admin interface

## 🔐 Admin Access

**Default Password:** `majestic2024`

**To change the password:**
1. Open `src/contexts/AdminContext.tsx`
2. Change the `ADMIN_PASSWORD` constant on line 8

**Admin URLs:**
- Login: `http://localhost:8080/admin/login`
- Admin Panel: `http://localhost:8080/admin`

## 📦 Supabase Setup Required

You need to set up two things in Supabase:

### 1. Create Artworks Table

Run this SQL in your Supabase SQL Editor:

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

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Allow public read access (customers can view)
CREATE POLICY "Public read access" ON artworks
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (you'll need to set up auth)
-- For now, you can disable RLS or create a service role policy
```

### 2. Create Storage Bucket for Images

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Name it: `artworks`
5. Make it **Public** (so images can be accessed)
6. Click **Create bucket**

### 3. Set Storage Policies (Optional but Recommended)

In the Storage section, click on the `artworks` bucket, then go to **Policies**:

```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'artworks');

-- Allow authenticated uploads (you'll need to set up auth for this)
-- For now, you can use the service role key for uploads
```

## 🚀 How to Use

### Accessing Admin Panel

1. Go to `http://localhost:8080/admin/login`
2. Enter password: `majestic2024` (or your custom password)
3. You'll be redirected to the admin panel

### Adding New Artwork

1. Click **"Add New Artwork"** button
2. Fill in all the fields:
   - **Title**: Name of your artwork
   - **Category**: Paintings, Digital, or Mixed Media
   - **Image**: Upload an image file (or paste a URL)
   - **Price**: Price in dollars
   - **Year**: Year created
   - **Dimensions**: e.g., `24" x 36"`
   - **Description**: Description of the artwork
   - **Available**: Check if it's available for purchase
3. Click **"Add Artwork"**

### Editing Artwork

1. Find the artwork in the list
2. Click **"Edit"** button
3. Make your changes
4. Click **"Update"**

### Deleting Artwork

1. Find the artwork in the list
2. Click **"Delete"** button
3. Confirm deletion

## 🔄 Updating Your Website to Use Database

Currently, your website uses static data from `src/data/artworks.ts`. To make it use the database:

1. Update `src/data/artworks.ts` to fetch from Supabase
2. Or create a hook that loads artworks from the database

Would you like me to update the website to automatically load artworks from the database?

## 🔒 Security Notes

- The admin password is stored in the code (not ideal for production)
- For production, consider:
  - Using Supabase Auth for proper authentication
  - Using environment variables for the password
  - Adding rate limiting
  - Using HTTPS

## 📝 Next Steps

1. Set up the Supabase table and storage bucket (see above)
2. Test the admin panel by adding your first artwork
3. Update your website to load artworks from the database (optional)

## ❓ Troubleshooting

**"Failed to upload image"**
- Make sure the `artworks` storage bucket exists in Supabase
- Check that the bucket is set to public
- Verify your Supabase credentials in `src/lib/supabase.ts`

**"Error fetching artworks"**
- Make sure the `artworks` table exists in Supabase
- Check the table structure matches the SQL above
- Verify your Supabase credentials

**Can't access admin panel**
- Make sure you're going to `/admin/login` first
- Check the password in `src/contexts/AdminContext.tsx`
- Clear browser cache/localStorage if needed

