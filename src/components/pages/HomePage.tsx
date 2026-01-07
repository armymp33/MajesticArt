import { Artwork, heroImage } from '@/data/artworks';
import { getArtworks } from '@/services/artworkService';
import { getAssetPath } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
interface HomePageProps {
  setCurrentPage: (page: string) => void;
}
const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage
}) => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const allArtworks = await getArtworks();
        // Filter for homepage: show artworks with display_location = 'homepage' or 'all', and available = true
        const homepageArtworks = allArtworks.filter(
          (artwork) => 
            artwork.available && 
            (artwork.display_location === 'homepage' || artwork.display_location === 'all' || !artwork.display_location)
        );
        // Show first 6
        setFeaturedArtworks(homepageArtworks.slice(0, 6));
      } catch (error) {
        console.error('Error loading artworks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, []);
  return <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${getAssetPath(heroImage)})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C]/80 via-[#2C2C2C]/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-4 animate-fade-in">
              Contemporary Abstract Art
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"><span className="block text-[#C4B3E0]">Art, as timeless as</span>the mountain mist</h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Original artworks and custom commissions that transform spaces and inspire connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setCurrentPage('gallery')} className="px-8 py-4 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors">
                Explore Gallery
              </button>
              <button onClick={() => setCurrentPage('commission')} className="px-8 py-4 bg-[#8B4A8B] text-white font-medium tracking-wide uppercase hover:bg-[#9B5A9B] transition-colors">
                Commission Art
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Selected Works</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">Featured Collection</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-12 text-[#2C2C2C]/60">Loading artworks...</div>
            ) : featuredArtworks.length === 0 ? (
              <div className="col-span-full text-center py-12 text-[#2C2C2C]/60">No featured artworks yet.</div>
            ) : (
              featuredArtworks.map(artwork => (
                <div key={artwork.id} className="group cursor-pointer" onClick={() => setCurrentPage('shop')}>
                  <div className="relative overflow-hidden mb-4">
                    <img src={artwork.image} alt={artwork.title} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/20 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-block px-4 py-2 bg-white text-[#2C2C2C] text-sm font-medium">
                        View Details
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif text-[#2C2C2C] group-hover:text-[#9B86BD] transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="text-[#D4AF37] font-medium" data-mixed-content="true">${artwork.price}</p>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <button onClick={() => setCurrentPage('gallery')} className="inline-flex items-center gap-2 text-[#2C2C2C] hover:text-[#9B86BD] transition-colors group">
              <span className="text-sm tracking-wide uppercase">View All Works</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-[#2C2C2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">The Artist</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Creating Art That Speaks
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Every brushstroke tells a story. My work explores the delicate balance between light and shadow, 
                emotion and stillness. Through abstract forms and rich textures, I invite viewers to find their 
                own meaning within each piece.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Based in Portland, Oregon, I create original paintings and custom commissions for collectors 
                and spaces around the world.
              </p>
              <button onClick={() => setCurrentPage('about')} className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E5C048] transition-colors group">
                <span className="text-sm tracking-wide uppercase">Learn More</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#9B86BD]/20 to-[#D4AF37]/20 rounded-lg overflow-hidden">
                <img src={featuredArtworks[0]?.image?.startsWith('http') ? featuredArtworks[0].image : getAssetPath(featuredArtworks[0]?.image || '/japanese-imperial-te.png')} alt="Featured artwork" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#D4AF37] rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">What I Offer</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">Ways to Collect</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Original Works */}
            <div className="group p-8 bg-white border border-[#2C2C2C]/10 hover:border-[#9B86BD] transition-colors cursor-pointer" onClick={() => setCurrentPage('gallery')}>
              <div className="w-14 h-14 rounded-full bg-[#9B86BD]/10 flex items-center justify-center mb-6 group-hover:bg-[#9B86BD]/20 transition-colors">
                <svg className="w-7 h-7 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Original Works</h3>
              <p className="text-[#2C2C2C]/60 mb-4">
                One-of-a-kind paintings created with intention and care. Each piece is unique and comes with a certificate of authenticity.
              </p>
              <span className="text-[#D4AF37] text-sm tracking-wide uppercase">Browse Gallery</span>
            </div>

            {/* Prints & Canvas */}
            <div className="group p-8 bg-white border border-[#2C2C2C]/10 hover:border-[#9B86BD] transition-colors cursor-pointer" onClick={() => setCurrentPage('shop')}>
              <div className="w-14 h-14 rounded-full bg-[#9B86BD]/10 flex items-center justify-center mb-6 group-hover:bg-[#9B86BD]/20 transition-colors">
                <svg className="w-7 h-7 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Prints & Canvas</h3>
              <p className="text-[#2C2C2C]/60 mb-4">
                Museum-quality reproductions available in various sizes. Fine art prints, gallery canvas, and framed options.
              </p>
              <span className="text-[#D4AF37] text-sm tracking-wide uppercase">Shop Now</span>
            </div>

            {/* Commissions */}
            <div className="group p-8 bg-white border border-[#2C2C2C]/10 hover:border-[#9B86BD] transition-colors cursor-pointer" onClick={() => setCurrentPage('commission')}>
              <div className="w-14 h-14 rounded-full bg-[#9B86BD]/10 flex items-center justify-center mb-6 group-hover:bg-[#9B86BD]/20 transition-colors">
                <svg className="w-7 h-7 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Custom Commissions</h3>
              <p className="text-[#2C2C2C]/60 mb-4">
                Work directly with me to create a piece tailored to your vision, space, and style. Various tiers available.
              </p>
              <span className="text-[#D4AF37] text-sm tracking-wide uppercase">Learn More</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-[#9B86BD]/10 to-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Kind Words</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">From Collectors</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            quote: "The commissioned piece exceeded all expectations. It's the centerpiece of our living room and sparks conversation every time guests visit.",
            author: "Sarah M.",
            location: "Seattle, WA"
          }, {
            quote: "Working with the artist was a dream. She truly understood my vision and translated it into something more beautiful than I imagined.",
            author: "Michael R.",
            location: "San Francisco, CA"
          }, {
            quote: "The quality of the canvas print is exceptional. The colors are vibrant and true to the original. I'll definitely be ordering more.",
            author: "Emma L.",
            location: "Austin, TX"
          }].map((testimonial, index) => <div key={index} className="bg-white p-8 shadow-sm">
                <svg className="w-8 h-8 text-[#D4AF37] mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[#2C2C2C]/80 leading-relaxed mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-[#2C2C2C]">{testimonial.author}</p>
                  <p className="text-sm text-[#2C2C2C]/60">{testimonial.location}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#2C2C2C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Whether you're looking for an original work, a beautiful print, or a custom commission, 
            I'd love to help you find art that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setCurrentPage('shop')} className="px-8 py-4 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors">
              Shop Now
            </button>
            <button onClick={() => setCurrentPage('commission')} className="px-8 py-4 bg-[#8B4A8B] text-white font-medium tracking-wide uppercase hover:bg-[#9B5A9B] transition-colors">
              Start a Commission
            </button>
          </div>
        </div>
      </section>
    </div>;
};
export default HomePage;