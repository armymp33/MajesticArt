import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/contexts/AdminContext';
import { Artwork, ProductVariant, printOptions } from '@/data/artworks';
import { toast } from '@/hooks/use-toast';
import { addArtwork, deleteArtwork, getArtworks, updateArtwork, uploadImage } from '@/services/artworkService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'paintings' as 'paintings' | 'digital' | 'mixed-media',
    image: '',
    price: '',
    description: '',
    dimensions: '',
    year: new Date().getFullYear().toString(),
    available: true,
    display_location: 'all' as 'homepage' | 'gallery' | 'shop' | 'all' | 'none',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  
  // Edit product variants state
  const [editVariantFiles, setEditVariantFiles] = useState<File[]>([]);
  const [editVariantAssignments, setEditVariantAssignments] = useState<{ [key: string]: { productTypeId: string; size: string; preview: string } }>({});
  const [editDragOver, setEditDragOver] = useState(false);
  const [variantsToRemove, setVariantsToRemove] = useState<number[]>([]);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { progress: number; status: 'uploading' | 'success' | 'error'; url?: string } }>({});
  const [bulkUploading, setBulkUploading] = useState(false);
  
  // New bulk artwork upload state
  const [bulkArtworkForm, setBulkArtworkForm] = useState({
    title: '',
    category: 'paintings' as 'paintings' | 'digital' | 'mixed-media',
    description: '',
    year: new Date().getFullYear().toString(),
    available: true,
    display_location: 'all' as 'homepage' | 'gallery' | 'shop' | 'all' | 'none',
  });
  const [imageAssignments, setImageAssignments] = useState<{ [key: string]: { productTypeId: string; size: string; preview: string } }>({});
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadArtworks();
  }, [isAuthenticated, navigate]);

  const loadArtworks = async () => {
    setLoading(true);
    const data = await getArtworks();
    setArtworks(data);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addBulkFiles(files);
  };

  const addBulkFiles = (files: File[]) => {
    const newFiles = [...bulkFiles];
    const newAssignments = { ...imageAssignments };
    
    files.forEach(file => {
      if (!bulkFiles.find(f => f.name === file.name && f.size === file.size)) {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newAssignments[file.name] = {
            productTypeId: '',
            size: '',
            preview: reader.result as string
          };
          setImageAssignments({ ...newAssignments });
        };
        reader.readAsDataURL(file);
      }
    });
    
    setBulkFiles(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addBulkFiles(files);
  };

  const removeBulkFile = (fileName: string) => {
    setBulkFiles(bulkFiles.filter(f => f.name !== fileName));
    const newAssignments = { ...imageAssignments };
    delete newAssignments[fileName];
    setImageAssignments(newAssignments);
  };

  const updateImageAssignment = (fileName: string, productTypeId: string, size: string) => {
    setImageAssignments(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        productTypeId,
        size
      }
    }));
  };

  const handleBulkArtworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkArtworkForm.title || bulkFiles.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and upload at least one image.',
        variant: 'destructive',
      });
      return;
    }

    // Check that all images are assigned
    const unassigned = bulkFiles.filter(f => {
      const assignment = imageAssignments[f.name];
      return !assignment?.productTypeId || !assignment?.size;
    });

    if (unassigned.length > 0) {
      toast({
        title: 'Unassigned Images',
        description: `Please assign product type and size for all ${unassigned.length} image(s).`,
        variant: 'destructive',
      });
      return;
    }

    setBulkUploading(true);
    setUploading(true);

    try {
      // Upload all images
      const productVariants: ProductVariant[] = [];
      let mainImage = '';

      for (const file of bulkFiles) {
        const assignment = imageAssignments[file.name];
        const productType = printOptions.find(p => p.id === assignment.productTypeId);
        const sizeOption = productType?.sizes.find(s => s.size === assignment.size);

        if (!productType || !sizeOption) continue;

        try {
          const uploadedUrl = await uploadImage(file);
          if (uploadedUrl) {
            if (!mainImage) mainImage = uploadedUrl; // Use first uploaded as main image
            
            productVariants.push({
              productTypeId: assignment.productTypeId,
              size: assignment.size,
              image: uploadedUrl,
              price: sizeOption.price
            });
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      }

      if (productVariants.length === 0) {
        throw new Error('Failed to upload any images');
      }

      // Get base price from lowest variant
      const basePrice = Math.min(...productVariants.map(v => v.price));

      // Create artwork
      const artworkData = {
        title: bulkArtworkForm.title,
        category: bulkArtworkForm.category,
        image: mainImage,
        price: basePrice,
        description: bulkArtworkForm.description,
        dimensions: '', // Dimensions are handled by product variants
        year: parseInt(bulkArtworkForm.year),
        available: bulkArtworkForm.available,
        display_location: bulkArtworkForm.display_location,
        productVariants: productVariants
      };

      const added = await addArtwork(artworkData);
      if (added) {
        toast({
          title: 'Success',
          description: `Artwork "${bulkArtworkForm.title}" created with ${productVariants.length} product variants!`,
        });
        
        // Reset form
        setBulkFiles([]);
        setImageAssignments({});
        setBulkArtworkForm({
          title: '',
          category: 'paintings',
          description: '',
          dimensions: '',
          year: new Date().getFullYear().toString(),
          available: true,
          display_location: 'all',
        });
        await loadArtworks();
      } else {
        throw new Error('Failed to create artwork');
      }
    } catch (error: any) {
      console.error('Error creating bulk artwork:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create artwork. Check browser console for details.',
        variant: 'destructive',
      });
    } finally {
      setBulkUploading(false);
      setUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one image to upload.',
        variant: 'destructive',
      });
      return;
    }

    setBulkUploading(true);
    const uploadedUrls: { fileName: string; url: string }[] = [];

    for (let i = 0; i < bulkFiles.length; i++) {
      const file = bulkFiles[i];
      const fileName = file.name;

      try {
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: { progress: 0, status: 'uploading' }
        }));

        const uploadedUrl = await uploadImage(file);
        
        if (uploadedUrl) {
          uploadedUrls.push({ fileName, url: uploadedUrl });
          setUploadProgress(prev => ({
            ...prev,
            [fileName]: { progress: 100, status: 'success', url: uploadedUrl }
          }));
        } else {
          setUploadProgress(prev => ({
            ...prev,
            [fileName]: { progress: 0, status: 'error' }
          }));
        }
      } catch (error: any) {
        console.error(`Error uploading ${fileName}:`, error);
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: { progress: 0, status: 'error' }
        }));
      }
    }

    setBulkUploading(false);

    if (uploadedUrls.length > 0) {
      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${uploadedUrls.length} of ${bulkFiles.length} images.`,
      });
      
      // Copy URLs to clipboard for easy access
      const urlsText = uploadedUrls.map(u => `${u.fileName}: ${u.url}`).join('\n');
      navigator.clipboard.writeText(urlsText).then(() => {
        toast({
          title: 'URLs Copied',
          description: 'Image URLs have been copied to your clipboard.',
        });
      });
    } else {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images. Check browser console for details.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new file was selected
      if (imageFile) {
        try {
          const uploadedUrl = await uploadImage(imageFile);
          if (!uploadedUrl) {
            toast({
              title: 'Error',
              description: 'Failed to upload image. Check browser console for details.',
              variant: 'destructive',
            });
            setUploading(false);
            return;
          }
          imageUrl = uploadedUrl;
        } catch (uploadError: unknown) {
          const error = uploadError as { message?: string };
          console.error('Upload failed:', error);
          toast({
            title: 'Upload Error',
            description: error?.message || 'Failed to upload image. Make sure storage bucket and policies are set up correctly.',
            variant: 'destructive',
          });
          setUploading(false);
          return;
        }
      }

      // Handle product variants for edit mode
      let productVariants: ProductVariant[] = editingArtwork?.productVariants || [];
      
      // Remove variants that were marked for deletion
      if (variantsToRemove.length > 0) {
        productVariants = productVariants.filter((_, index) => !variantsToRemove.includes(index));
      }
      
      if (editVariantFiles.length > 0) {
        // Check that all images are assigned
        const unassigned = editVariantFiles.filter(f => {
          const assignment = editVariantAssignments[f.name];
          return !assignment?.productTypeId || !assignment?.size;
        });

        if (unassigned.length > 0) {
          toast({
            title: 'Unassigned Images',
            description: `Please assign product type and size for all ${unassigned.length} image(s).`,
            variant: 'destructive',
          });
          setUploading(false);
          return;
        }

        // Upload new variant images
        for (const file of editVariantFiles) {
          const assignment = editVariantAssignments[file.name];
          const productType = printOptions.find(p => p.id === assignment.productTypeId);
          const sizeOption = productType?.sizes.find(s => s.size === assignment.size);

          if (!productType || !sizeOption) continue;

          try {
            const uploadedUrl = await uploadImage(file);
            if (uploadedUrl) {
              // Check if variant already exists and replace it, or add new one
              const existingIndex = productVariants.findIndex(
                v => v.productTypeId === assignment.productTypeId && v.size === assignment.size
              );
              
              const newVariant: ProductVariant = {
                productTypeId: assignment.productTypeId,
                size: assignment.size,
                image: uploadedUrl,
                price: sizeOption.price
              };

              if (existingIndex >= 0) {
                productVariants[existingIndex] = newVariant;
              } else {
                productVariants.push(newVariant);
              }
            }
          } catch (error) {
            console.error(`Error uploading variant ${file.name}:`, error);
          }
        }
      }

      const artworkData = {
        title: formData.title,
        category: formData.category,
        image: imageUrl,
        price: parseFloat(formData.price),
        description: formData.description,
        dimensions: '', // Dimensions are handled by product variants
        year: parseInt(formData.year),
        available: formData.available,
        display_location: formData.display_location,
        productVariants: productVariants.length > 0 ? productVariants : undefined,
      };

      if (editingArtwork) {
        // Update existing artwork
        const updated = await updateArtwork(editingArtwork.id, artworkData);
        if (updated) {
          toast({
            title: 'Success',
            description: 'Artwork updated successfully',
          });
          await loadArtworks();
          resetForm();
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update artwork',
            variant: 'destructive',
          });
        }
      } else {
        // Add new artwork
        try {
          const added = await addArtwork(artworkData);
          if (added) {
            toast({
              title: 'Success',
              description: 'Artwork added successfully',
            });
            await loadArtworks();
            resetForm();
          } else {
            toast({
              title: 'Error',
              description: 'Failed to add artwork - no data returned',
              variant: 'destructive',
            });
          }
        } catch (dbError: unknown) {
          const error = dbError as { message?: string };
          console.error('Database error:', error);
          toast({
            title: 'Database Error',
            description: error?.message || 'Failed to add artwork. Check browser console for details.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      category: artwork.category,
      image: artwork.image,
      price: artwork.price.toString(),
      description: artwork.description,
      dimensions: artwork.dimensions,
      year: artwork.year.toString(),
      available: artwork.available,
      display_location: artwork.display_location || 'all',
    });
    setImagePreview(artwork.image);
    setImageFile(null);
    setEditVariantFiles([]);
    setEditVariantAssignments({});
    setVariantsToRemove([]);
    setIsDialogOpen(true);
  };

  const removeVariant = (index: number) => {
    setVariantsToRemove(prev => [...prev, index]);
  };

  const restoreVariant = (index: number) => {
    setVariantsToRemove(prev => prev.filter(i => i !== index));
  };

  const addEditVariantFiles = (files: File[]) => {
    const newFiles = [...editVariantFiles];
    const newAssignments = { ...editVariantAssignments };
    
    files.forEach(file => {
      if (!editVariantFiles.find(f => f.name === file.name && f.size === file.size)) {
        newFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          newAssignments[file.name] = {
            productTypeId: '',
            size: '',
            preview: reader.result as string
          };
          setEditVariantAssignments({ ...newAssignments });
        };
        reader.readAsDataURL(file);
      }
    });
    
    setEditVariantFiles(newFiles);
  };

  const handleEditVariantFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addEditVariantFiles(files);
  };

  const handleEditDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setEditDragOver(true);
  };

  const handleEditDragLeave = () => {
    setEditDragOver(false);
  };

  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setEditDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addEditVariantFiles(files);
  };

  const removeEditVariantFile = (fileName: string) => {
    setEditVariantFiles(editVariantFiles.filter(f => f.name !== fileName));
    const newAssignments = { ...editVariantAssignments };
    delete newAssignments[fileName];
    setEditVariantAssignments(newAssignments);
  };

  const updateEditVariantAssignment = (fileName: string, productTypeId: string, size: string) => {
    setEditVariantAssignments(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        productTypeId,
        size
      }
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    const success = await deleteArtwork(id);
    if (success) {
      toast({
        title: 'Success',
        description: 'Artwork deleted successfully',
      });
      await loadArtworks();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete artwork',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'paintings',
      image: '',
      price: '',
      description: '',
      dimensions: '',
      year: new Date().getFullYear().toString(),
      available: true,
      display_location: 'all',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingArtwork(null);
    setEditVariantFiles([]);
    setEditVariantAssignments({});
    setVariantsToRemove([]);
    setIsDialogOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <div className="bg-white border-b border-[#2C2C2C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-[#2C2C2C]">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
              >
                View Website
              </Button>
              <Button
                onClick={logout}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setBulkUploadMode(false)}
            variant={!bulkUploadMode ? "default" : "outline"}
            className={!bulkUploadMode ? "bg-[#8B4A8B] hover:bg-[#9B5A9B]" : ""}
          >
            Single Upload
          </Button>
          <Button
            onClick={() => setBulkUploadMode(true)}
            variant={bulkUploadMode ? "default" : "outline"}
            className={bulkUploadMode ? "bg-[#8B4A8B] hover:bg-[#9B5A9B]" : ""}
          >
            Add New Artwork (Bulk)
          </Button>
        </div>

        {/* Bulk Artwork Upload Section */}
        {bulkUploadMode && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-[#2C2C2C]/10 p-6">
            <h2 className="text-xl font-serif text-[#2C2C2C] mb-4">Add New Artwork with Multiple Product Variants</h2>
            <p className="text-sm text-[#2C2C2C]/60 mb-6">
              Upload multiple images and assign each to a product type and size. Each size will show its own image when customers select it.
            </p>
            
            <form onSubmit={handleBulkArtworkSubmit} className="space-y-6">
              {/* Artwork Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bulk-title">Title *</Label>
                  <Input
                    id="bulk-title"
                    value={bulkArtworkForm.title}
                    onChange={(e) => setBulkArtworkForm({ ...bulkArtworkForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-category">Category</Label>
                  <Select
                    value={bulkArtworkForm.category}
                    onValueChange={(value: 'paintings' | 'digital' | 'mixed-media') =>
                      setBulkArtworkForm({ ...bulkArtworkForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paintings">Paintings</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bulk-year">Year</Label>
                  <Input
                    id="bulk-year"
                    type="number"
                    value={bulkArtworkForm.year}
                    onChange={(e) => setBulkArtworkForm({ ...bulkArtworkForm, year: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bulk-description">Description</Label>
                  <Textarea
                    id="bulk-description"
                    value={bulkArtworkForm.description}
                    onChange={(e) => setBulkArtworkForm({ ...bulkArtworkForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="bulk-display-location">Display Location</Label>
                  <Select
                    value={bulkArtworkForm.display_location}
                    onValueChange={(value: 'homepage' | 'gallery' | 'shop' | 'all' | 'none') =>
                      setBulkArtworkForm({ ...bulkArtworkForm, display_location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      <SelectItem value="homepage">Homepage Only</SelectItem>
                      <SelectItem value="gallery">Gallery Only</SelectItem>
                      <SelectItem value="shop">Shop Only</SelectItem>
                      <SelectItem value="none">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bulk-available"
                    checked={bulkArtworkForm.available}
                    onChange={(e) => setBulkArtworkForm({ ...bulkArtworkForm, available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="bulk-available">Available for purchase</Label>
                </div>
              </div>

              {/* Drag and Drop Area */}
              <div>
                <Label>Upload Images *</Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? 'border-[#8B4A8B] bg-[#8B4A8B]/5' : 'border-[#2C2C2C]/20'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkFileSelect}
                    className="hidden"
                    id="bulk-file-input"
                  />
                  <label htmlFor="bulk-file-input" className="cursor-pointer">
                    <svg className="w-12 h-12 mx-auto mb-4 text-[#2C2C2C]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-[#2C2C2C] mb-2">
                      Drag and drop images here, or click to select
                    </p>
                    <p className="text-xs text-[#2C2C2C]/60">
                      Upload one image per product type and size combination
                    </p>
                  </label>
                </div>
              </div>

              {/* Image Assignment Grid */}
              {bulkFiles.length > 0 && (
                <div>
                  <Label className="mb-3 block">Assign Images to Product Types & Sizes *</Label>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bulkFiles.map((file) => {
                      const assignment = imageAssignments[file.name];
                      const productType = printOptions.find(p => p.id === assignment?.productTypeId);
                      return (
                        <div key={file.name} className="border border-[#2C2C2C]/10 rounded-lg p-4">
                          <div className="flex gap-4">
                            <img
                              src={assignment?.preview || ''}
                              alt={file.name}
                              className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs">Product Type</Label>
                                <Select
                                  value={assignment?.productTypeId || ''}
                                  onValueChange={(value) => {
                                    updateImageAssignment(file.name, value, '');
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {printOptions.map(option => (
                                      <SelectItem key={option.id} value={option.id}>
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Size</Label>
                                <Select
                                  value={assignment?.size || ''}
                                  onValueChange={(value) => {
                                    updateImageAssignment(file.name, assignment?.productTypeId || '', value);
                                  }}
                                  disabled={!assignment?.productTypeId}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {productType?.sizes.map(size => (
                                      <SelectItem key={size.size} value={size.size}>
                                        {size.size} - ${size.price}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeBulkFile(file.name)}
                              className="self-start"
                            >
                              Remove
                            </Button>
                          </div>
                          <p className="text-xs text-[#2C2C2C]/60 mt-2 truncate">{file.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={bulkUploading || bulkFiles.length === 0}
                  className="bg-[#8B4A8B] hover:bg-[#9B5A9B]"
                >
                  {bulkUploading ? 'Creating Artwork...' : 'Create Artwork with Product Variants'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setBulkFiles([]);
                    setImageAssignments({});
                    setBulkArtworkForm({
                      title: '',
                      category: 'paintings',
                      description: '',
                      year: new Date().getFullYear().toString(),
                      available: true,
                      display_location: 'all',
                    });
                  }}
                >
                  Clear All
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Add Artwork Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-[#8B4A8B] hover:bg-[#9B5A9B]">
                Add New Artwork
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'paintings' | 'digital' | 'mixed-media') =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paintings">Paintings</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="mixed-media">Mixed Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="display_location">Display Location</Label>
                  <Select
                    value={formData.display_location}
                    onValueChange={(value: 'homepage' | 'gallery' | 'shop' | 'all' | 'none') =>
                      setFormData({ ...formData, display_location: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages (Homepage, Gallery, Shop)</SelectItem>
                      <SelectItem value="homepage">Homepage Only (Featured)</SelectItem>
                      <SelectItem value="gallery">Gallery Page Only</SelectItem>
                      <SelectItem value="shop">Shop Page Only</SelectItem>
                      <SelectItem value="none">Hidden (Admin Only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Choose where this artwork will be displayed on your website</p>
                </div>

                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                  {!imageFile && editingArtwork && (
                    <Input
                      className="mt-2"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or enter image URL"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {/* Add Product Variants Section */}
                <div className="border-t border-[#2C2C2C]/10 pt-4">
                  <Label className="text-base font-medium mb-2 block">Add Product Variants</Label>
                  <p className="text-xs text-[#2C2C2C]/60 mb-4">
                    Upload images for different product types (wall hanging, mug, pillow, etc.) and sizes. These will be added to existing variants.
                  </p>
                  
                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleEditDragOver}
                    onDragLeave={handleEditDragLeave}
                    onDrop={handleEditDrop}
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors mb-4 ${
                      editDragOver ? 'border-[#8B4A8B] bg-[#8B4A8B]/5' : 'border-[#2C2C2C]/20'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditVariantFileSelect}
                      className="hidden"
                      id="edit-variant-file-input"
                    />
                    <label htmlFor="edit-variant-file-input" className="cursor-pointer">
                      <svg className="w-8 h-8 mx-auto mb-2 text-[#2C2C2C]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs text-[#2C2C2C] mb-1">
                        Drag and drop images or click to select
                      </p>
                      <p className="text-xs text-[#2C2C2C]/60">
                        Assign each to a product type and size
                      </p>
                    </label>
                  </div>

                  {/* Existing Variants Display */}
                  {editingArtwork?.productVariants && editingArtwork.productVariants.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-[#2C2C2C] mb-2">Existing Product Variants:</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {editingArtwork.productVariants.map((variant, idx) => {
                          const productType = printOptions.find(p => p.id === variant.productTypeId);
                          const isRemoved = variantsToRemove.includes(idx);
                          return (
                            <div 
                              key={idx} 
                              className={`text-xs bg-[#2C2C2C]/5 p-2 rounded flex items-center justify-between ${
                                isRemoved ? 'opacity-50 line-through' : ''
                              }`}
                            >
                              <span className="text-[#2C2C2C]/60">
                                {productType?.name || variant.productTypeId} - {variant.size} (${variant.price})
                              </span>
                              {isRemoved ? (
                                <button
                                  type="button"
                                  onClick={() => restoreVariant(idx)}
                                  className="text-xs text-green-600 hover:text-green-700 px-2 py-1"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeVariant(idx)}
                                  className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Image Assignment Grid */}
                  {editVariantFiles.length > 0 && (
                    <div>
                      <Label className="mb-2 block text-sm">Assign Images to Product Types & Sizes</Label>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {editVariantFiles.map((file) => {
                          const assignment = editVariantAssignments[file.name];
                          const productType = printOptions.find(p => p.id === assignment?.productTypeId);
                          return (
                            <div key={file.name} className="border border-[#2C2C2C]/10 rounded-lg p-3">
                              <div className="flex gap-3">
                                <img
                                  src={assignment?.preview || ''}
                                  alt={file.name}
                                  className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs">Product Type</Label>
                                    <Select
                                      value={assignment?.productTypeId || ''}
                                      onValueChange={(value) => {
                                        updateEditVariantAssignment(file.name, value, '');
                                      }}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select product type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {printOptions.map(option => (
                                          <SelectItem key={option.id} value={option.id}>
                                            {option.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-xs">Size</Label>
                                    <Select
                                      value={assignment?.size || ''}
                                      onValueChange={(value) => {
                                        updateEditVariantAssignment(file.name, assignment?.productTypeId || '', value);
                                      }}
                                      disabled={!assignment?.productTypeId}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {productType?.sizes.map(size => (
                                          <SelectItem key={size.size} value={size.size}>
                                            {size.size} - ${size.price}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeEditVariantFile(file.name)}
                                  className="self-start h-8"
                                >
                                  Remove
                                </Button>
                              </div>
                              <p className="text-xs text-[#2C2C2C]/60 mt-1 truncate">{file.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="available">Available for purchase</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-[#8B4A8B] hover:bg-[#9B5A9B]"
                  >
                    {uploading ? 'Saving...' : editingArtwork ? 'Update' : 'Add Artwork'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Artworks List */}
        {loading ? (
          <div className="text-center py-12">Loading artworks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="bg-white rounded-lg shadow-sm border border-[#2C2C2C]/10 overflow-hidden">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-serif text-lg text-[#2C2C2C] mb-2">{artwork.title}</h3>
                  <p className="text-sm text-[#2C2C2C]/60 mb-2">{artwork.category}</p>
                  <p className="text-[#D4AF37] font-medium mb-4">${artwork.price}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(artwork)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(artwork.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && artworks.length === 0 && (
          <div className="text-center py-12 text-[#2C2C2C]/60">
            No artworks yet. Add your first artwork above!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

