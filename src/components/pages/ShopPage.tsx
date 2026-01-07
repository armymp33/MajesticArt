import React, { useState, useEffect } from 'react';
import { printOptions, Artwork } from '@/data/artworks';
import { getArtworks } from '@/services/artworkService';
import { useCart } from '@/contexts/CartContext';

interface ShopPageProps {
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
  searchQuery?: string;
}

const ShopPage: React.FC<ShopPageProps> = ({ selectedArtwork, setSelectedArtwork, searchQuery = '' }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewingArtwork, setViewingArtwork] = useState<Artwork | null>(selectedArtwork);
  const [selectedProduct, setSelectedProduct] = useState(printOptions[0]);
  const [selectedSize, setSelectedSize] = useState(printOptions[0].sizes[0]);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const allArtworks = await getArtworks();
        // Filter for shop: show artworks with display_location = 'shop' or 'all', and available = true
        const shopArtworks = allArtworks.filter(
          (artwork) => 
            artwork.available && 
            (artwork.display_location === 'shop' || artwork.display_location === 'all' || !artwork.display_location)
        );
        setArtworks(shopArtworks);
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, []);

  useEffect(() => {
    if (selectedArtwork) {
      setViewingArtwork(selectedArtwork);
      setSelectedArtwork(null);
    }
  }, [selectedArtwork, setSelectedArtwork]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'paintings', label: 'Paintings' },
    { id: 'digital', label: 'Digital' },
    { id: 'mixed-media', label: 'Mixed Media' }
  ];

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest' }
  ];

  let filteredArtworks = activeFilter === 'all' 
    ? artworks 
    : artworks.filter(a => a.category === activeFilter);

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredArtworks = filteredArtworks.filter(artwork => 
      artwork.title.toLowerCase().includes(query) ||
      artwork.description.toLowerCase().includes(query) ||
      artwork.category.toLowerCase().includes(query)
    );
  }

  // Sort artworks
  switch (sortBy) {
    case 'price-low':
      filteredArtworks = [...filteredArtworks].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredArtworks = [...filteredArtworks].sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredArtworks = [...filteredArtworks].sort((a, b) => b.year - a.year);
      break;
  }

  const handleAddToCart = () => {
    if (!viewingArtwork) return;
    
    addToCart({
      artworkId: viewingArtwork.id,
      title: viewingArtwork.title,
      image: viewingArtwork.image,
      productType: selectedProduct.name,
      size: selectedSize.size,
      price: selectedSize.price
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleProductChange = (product: typeof printOptions[0]) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    // Reset zoom when changing product
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleSizeChange = (size: typeof printOptions[0]['sizes'][0]) => {
    setSelectedSize(size);
    // Reset zoom when changing size
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Removed scroll-to-zoom - only use + and - buttons

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom !== 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom !== 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  if (viewingArtwork) {
    return (
      <div className="pt-20 min-h-screen bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <button
            onClick={() => setViewingArtwork(null)}
            className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Shop</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image with Zoom */}
            <div className="relative">
              {(() => {
                // Find the image for the selected product type and size
                const variant = viewingArtwork.productVariants?.find(
                  v => v.productTypeId === selectedProduct.id && v.size === selectedSize.size
                );
                const displayImage = variant?.image || viewingArtwork.image;
                return (
                  <div
                    className="relative w-full aspect-[4/5] overflow-hidden bg-[#2C2C2C]/5 rounded-lg cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ touchAction: 'none' }}
                  >
                    <img
                      src={displayImage}
                      alt={viewingArtwork.title}
                      className="w-full h-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transformOrigin: 'center center'
                      }}
                      draggable={false}
                    />
                    
                    {/* Zoom Controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => setZoom(prev => Math.min(prev + 0.25, 5))}
                        className="w-10 h-10 bg-white/90 hover:bg-white border border-[#2C2C2C]/20 rounded flex items-center justify-center transition-colors"
                        title="Zoom In"
                      >
                        <svg className="w-5 h-5 text-[#2C2C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.25))}
                        className="w-10 h-10 bg-white/90 hover:bg-white border border-[#2C2C2C]/20 rounded flex items-center justify-center transition-colors"
                        title="Zoom Out"
                      >
                        <svg className="w-5 h-5 text-[#2C2C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      {zoom !== 1 && (
                        <button
                          onClick={resetZoom}
                          className="w-10 h-10 bg-white/90 hover:bg-white border border-[#2C2C2C]/20 rounded flex items-center justify-center transition-colors"
                          title="Reset Zoom"
                        >
                          <svg className="w-5 h-5 text-[#2C2C2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    {/* Zoom Indicator */}
                    {zoom !== 1 && (
                      <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded text-sm text-[#2C2C2C] border border-[#2C2C2C]/20">
                        {Math.round(zoom * 100)}%
                      </div>
                    )}
                    
                    {/* Instructions */}
                    {zoom === 1 && (
                      <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded text-xs text-[#2C2C2C]/60 border border-[#2C2C2C]/20">
                        Use + / - buttons to zoom • Click & drag when zoomed
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Details */}
            <div>
              <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-2">
                {viewingArtwork.category.replace('-', ' ')}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-4">
                {viewingArtwork.title}
              </h1>
              <p className="text-[#2C2C2C]/70 mb-6">{viewingArtwork.description}</p>
              
              <div className="border-t border-b border-[#2C2C2C]/10 py-6 mb-6">
                <p className="text-sm text-[#2C2C2C]/60 mb-1">Original Dimensions</p>
                <p className="text-[#2C2C2C]">{viewingArtwork.dimensions}</p>
              </div>

              {/* Product Type Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[#2C2C2C] mb-3">Product Type</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                  {(() => {
                    // If artwork has product variants, only show those product types
                    // Otherwise show all product types
                    const availableProductTypes = viewingArtwork.productVariants && viewingArtwork.productVariants.length > 0
                      ? printOptions.filter(opt => 
                          viewingArtwork.productVariants?.some(v => v.productTypeId === opt.id)
                        )
                      : printOptions;
                    
                    return availableProductTypes.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleProductChange(option)}
                        className={`p-3 border text-center transition-colors ${
                          selectedProduct.id === option.id
                            ? 'border-[#9B86BD] bg-[#9B86BD]/5'
                            : 'border-[#2C2C2C]/10 hover:border-[#9B86BD]/50'
                        }`}
                      >
                        <p className="text-xs font-medium text-[#2C2C2C]">{option.name}</p>
                        <p className="text-xs text-[#2C2C2C]/60">From ${option.basePrice}</p>
                      </button>
                    ));
                  })()}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <p className="text-sm font-medium text-[#2C2C2C] mb-3">Size</p>
                <div className="grid grid-cols-2 gap-3">
                  {(() => {
                    // If artwork has product variants, only show sizes that have images
                    // Otherwise show all sizes for the product type
                    const availableSizes = viewingArtwork.productVariants && viewingArtwork.productVariants.length > 0
                      ? selectedProduct.sizes.filter(size =>
                          viewingArtwork.productVariants?.some(
                            v => v.productTypeId === selectedProduct.id && v.size === size.size
                          )
                        )
                      : selectedProduct.sizes;
                    
                    return availableSizes.map(size => {
                      const variant = viewingArtwork.productVariants?.find(
                        v => v.productTypeId === selectedProduct.id && v.size === size.size
                      );
                      const price = variant?.price || size.price;
                      
                      return (
                        <button
                          key={size.size}
                          onClick={() => {
                            handleSizeChange({ ...size, price });
                            setSelectedSize({ ...size, price });
                          }}
                          className={`p-4 border flex items-center justify-between transition-colors ${
                            selectedSize.size === size.size
                              ? 'border-[#9B86BD] bg-[#9B86BD]/5'
                              : 'border-[#2C2C2C]/10 hover:border-[#9B86BD]/50'
                          }`}
                        >
                          <span className="text-sm text-[#2C2C2C]">{size.size}</span>
                          <span className="text-sm font-medium text-[#D4AF37]">${price}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-serif text-[#2C2C2C]">${selectedSize.price}</span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 font-medium tracking-wide uppercase transition-colors ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#B8963A]'
                }`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              {/* Info */}
              <div className="mt-8 space-y-4 text-sm text-[#2C2C2C]/60">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Museum-quality archival printing on premium materials</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Free shipping on orders over $150</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>30-day satisfaction guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Shop</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6">Prints & Canvas</h1>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Bring the beauty of original art into your space with museum-quality prints and gallery canvas reproductions.
          </p>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-[#2C2C2C] text-white'
                      : 'bg-white text-[#2C2C2C] border border-[#2C2C2C]/20 hover:border-[#9B86BD]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#2C2C2C]/60">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-[#2C2C2C]/20 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#9B86BD]"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-[#2C2C2C]/60">Loading shop items...</div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-12 text-[#2C2C2C]/60">
              {searchQuery.trim() 
                ? `No artworks found matching "${searchQuery}".` 
                : 'No artworks available in this category.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.map((artwork) => (
              <div 
                key={artwork.id}
                className="group cursor-pointer"
                onClick={() => setViewingArtwork(artwork)}
              >
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/20 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-4 py-2 bg-white text-[#2C2C2C] text-sm font-medium">
                      View Options
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-serif text-[#2C2C2C] group-hover:text-[#9B86BD] transition-colors">
                  {artwork.title}
                </h3>
                <p className="text-sm text-[#2C2C2C]/60 capitalize mb-1">{artwork.category.replace('-', ' ')}</p>
                <p className="text-[#D4AF37] font-medium">From $45</p>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#9B86BD]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] mb-2">Premium Quality</h3>
              <p className="text-sm text-[#2C2C2C]/60">
                Archival inks and museum-grade materials ensure your print lasts a lifetime.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#9B86BD]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] mb-2">Secure Packaging</h3>
              <p className="text-sm text-[#2C2C2C]/60">
                Every order is carefully packaged to arrive in perfect condition.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#9B86BD]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-[#2C2C2C] mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-[#2C2C2C]/60">
                30-day returns if you're not completely happy with your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
