import React, { useState, useEffect } from 'react';
import { Artwork } from '@/data/artworks';
import { getArtworks } from '@/services/artworkService';

interface GalleryPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedArtwork: (artwork: Artwork | null) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ setCurrentPage, setSelectedArtwork }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const allArtworks = await getArtworks();
        // Filter for gallery: show artworks with display_location = 'gallery' or 'all', and available = true
        const galleryArtworks = allArtworks.filter(
          (artwork) => 
            artwork.available && 
            (artwork.display_location === 'gallery' || artwork.display_location === 'all' || !artwork.display_location)
        );
        setArtworks(galleryArtworks);
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, []);

  const filters = [
    { id: 'all', label: 'All Works' },
    { id: 'paintings', label: 'Paintings' },
    { id: 'digital', label: 'Digital' },
    { id: 'mixed-media', label: 'Mixed Media' }
  ];

  const filteredArtworks = activeFilter === 'all' 
    ? artworks 
    : artworks.filter(a => a.category === activeFilter);

  const handleViewInShop = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setCurrentPage('shop');
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">The Collection</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6">Gallery</h1>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Explore the complete collection of original works. Each piece is available as the original 
            or as high-quality prints and canvas reproductions.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-2 text-sm tracking-wide uppercase transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-[#2C2C2C] text-white'
                    : 'bg-white text-[#2C2C2C] border border-[#2C2C2C]/20 hover:border-[#9B86BD]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 text-[#2C2C2C]/60">Loading gallery...</div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-12 text-[#2C2C2C]/60">No artworks in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork) => (
              <div 
                key={artwork.id}
                className="group"
              >
                <div 
                  className="relative overflow-hidden mb-4 cursor-pointer"
                  onClick={() => setLightboxArtwork(artwork)}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 bg-white text-[#2C2C2C] text-sm font-medium">
                      View Larger
                    </span>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-serif text-[#2C2C2C]">{artwork.title}</h3>
                    <p className="text-sm text-[#2C2C2C]/60 capitalize">{artwork.category.replace('-', ' ')}</p>
                    <p className="text-sm text-[#2C2C2C]/60">{artwork.dimensions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#D4AF37] font-medium">${artwork.price}</p>
                    <button
                      onClick={() => handleViewInShop(artwork)}
                      className="text-sm text-[#9B86BD] hover:text-[#2C2C2C] transition-colors"
                    >
                      Shop Prints
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxArtwork && (
        <div 
          className="fixed inset-0 z-50 bg-[#2C2C2C]/95 flex items-center justify-center p-4"
          onClick={() => setLightboxArtwork(null)}
        >
          <button
            onClick={() => setLightboxArtwork(null)}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1">
              <img
                src={lightboxArtwork.image}
                alt={lightboxArtwork.title}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="md:w-80 text-white">
              <h2 className="text-2xl font-serif mb-2">{lightboxArtwork.title}</h2>
              <p className="text-white/60 mb-4">{lightboxArtwork.year}</p>
              <p className="text-white/80 mb-4">{lightboxArtwork.description}</p>
              <div className="space-y-2 text-sm text-white/60 mb-6">
                <p>Category: <span className="text-white capitalize">{lightboxArtwork.category.replace('-', ' ')}</span></p>
                <p>Dimensions: <span className="text-white">{lightboxArtwork.dimensions}</span></p>
                <p>Original Price: <span className="text-[#D4AF37]">${lightboxArtwork.price}</span></p>
              </div>
              <button
                onClick={() => {
                  setLightboxArtwork(null);
                  handleViewInShop(lightboxArtwork);
                }}
                className="w-full py-3 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors"
              >
                Shop This Artwork
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission CTA */}
      <section className="py-16 bg-gradient-to-r from-[#9B86BD]/20 to-[#D4AF37]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] mb-4">
            Looking for Something Unique?
          </h2>
          <p className="text-[#2C2C2C]/60 mb-6">
            Commission a custom piece tailored to your vision, space, and style.
          </p>
          <button
            onClick={() => setCurrentPage('commission')}
            className="px-8 py-4 bg-[#2C2C2C] text-white font-medium tracking-wide uppercase hover:bg-[#9B86BD] transition-colors"
          >
            Start a Commission
          </button>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
