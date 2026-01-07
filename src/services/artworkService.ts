import { supabase } from '@/lib/supabase';
import { Artwork } from '@/data/artworks';

// Upload image to Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = fileName;

    console.log('Attempting to upload:', fileName);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);

    // Skip bucket check - just try to upload directly
    // Use Supabase client to upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg',
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      console.error('Error message:', uploadError.message);
      console.error('Error name:', uploadError.name);
      
      // More specific error messages
      if (uploadError.message?.includes('new row violates row-level security') || 
          uploadError.message?.includes('policy')) {
        throw new Error('Storage policy error: Make sure you have an INSERT policy for the artworks bucket. Go to Storage → artworks → Policies and add an INSERT policy.');
      }
      if (uploadError.message?.includes('Bucket not found') || 
          uploadError.message?.includes('not found')) {
        throw new Error('Storage bucket "artworks" not found. Create it in Supabase Storage and make it public.');
      }
      if (uploadError.message?.includes('JWT') || 
          uploadError.message?.includes('Invalid API key') ||
          uploadError.message?.includes('unauthorized')) {
        throw new Error('Authentication error: Check your Supabase API key in src/lib/supabase.ts');
      }
      if (uploadError.name === 'StorageUnknownError' || uploadError.message?.includes('fetch')) {
        throw new Error('Cannot connect to Supabase storage. Check: 1) Your internet connection, 2) Supabase project is active, 3) Storage bucket exists and is public.');
      }
      
      throw new Error(`Upload failed: ${uploadError.message || uploadError.name || 'Unknown error'}`);
    }

    if (!uploadData) {
      throw new Error('Upload returned no data');
    }

    console.log('Upload successful:', uploadData);

    // Get public URL using the Supabase client
    const { data: urlData } = supabase.storage
      .from('artworks')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    console.log('Public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Re-throw with the error message
    if (error.message) {
      throw error;
    }
    throw new Error(`Upload failed: ${error.toString()}`);
  }
};

// Get all artworks from database
export const getArtworks = async (): Promise<Artwork[]> => {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching artworks:', error);
      return [];
    }

    // Map product_variants to productVariants for each artwork
    return (data || []).map(artwork => ({
      ...artwork,
      productVariants: artwork.product_variants || []
    })).map(({ product_variants, ...rest }) => rest) as Artwork[];
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }
};

// Add new artwork
export const addArtwork = async (artwork: Omit<Artwork, 'id'>): Promise<Artwork | null> => {
  try {
    console.log('Adding artwork to database:', artwork);
    
    // Map productVariants to product_variants for database
    const dbArtwork = {
      ...artwork,
      product_variants: artwork.productVariants || []
    };
    delete (dbArtwork as any).productVariants;
    
    const { data, error } = await supabase
      .from('artworks')
      .insert([dbArtwork])
      .select()
      .single();

    if (error) {
      console.error('Database error details:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      
      // Provide helpful error messages
      if (error.code === '42P01') {
        throw new Error('Table "artworks" does not exist. Create it in Supabase SQL Editor.');
      }
      if (error.code === '42501') {
        throw new Error('Permission denied. Check your Row Level Security policies for the artworks table.');
      }
      if (error.message?.includes('violates row-level security')) {
        throw new Error('Row Level Security policy error. Make sure you have an INSERT policy for the artworks table.');
      }
      
      throw new Error(`Database error: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    // Map product_variants back to productVariants
    const mappedData = {
      ...data,
      productVariants: data.product_variants || []
    };
    delete (mappedData as any).product_variants;

    console.log('Artwork added successfully:', mappedData);
    return mappedData;
  } catch (error: any) {
    console.error('Error adding artwork:', error);
    if (error.message) {
      throw error; // Re-throw with message
    }
    throw new Error(`Failed to add artwork: ${error.toString()}`);
  }
};

// Update artwork
export const updateArtwork = async (id: string, updates: Partial<Artwork>): Promise<Artwork | null> => {
  try {
    // Map productVariants to product_variants for database
    const dbUpdates: any = { ...updates };
    if (updates.productVariants !== undefined) {
      dbUpdates.product_variants = updates.productVariants;
      delete dbUpdates.productVariants;
    }
    
    const { data, error } = await supabase
      .from('artworks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating artwork:', error);
      return null;
    }

    // Map product_variants back to productVariants
    const mappedData = {
      ...data,
      productVariants: data.product_variants || []
    };
    delete (mappedData as any).product_variants;

    return mappedData;
  } catch (error) {
    console.error('Error updating artwork:', error);
    return null;
  }
};

// Delete artwork
export const deleteArtwork = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artwork:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return false;
  }
};

