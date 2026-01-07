import React from 'react';
import { artistImage, artworks } from '@/data/artworks';

interface AboutPageProps {
  setCurrentPage: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="pt-20 min-h-screen bg-[#FAF9F6]">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">The Artist</p>
              <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6">
                Creating Art That Moves the Soul
              </h1>
              <p className="text-[#2C2C2C]/70 leading-relaxed mb-6">
                Hello, I'm the artist behind Line & Light Studio. For over a decade, I've been exploring 
                the intersection of light, emotion, and abstract form through my work. Each piece I create 
                is a meditation on the beauty found in everyday moments—the way morning light filters 
                through a window, the quiet stillness of dusk, the energy of a bustling city street.
              </p>
              <p className="text-[#2C2C2C]/70 leading-relaxed mb-6">
                Based in Portland, Oregon, I work primarily with acrylics, mixed media, and digital 
                techniques. My palette draws from the natural world—soft violets of twilight, deep 
                charcoals of storm clouds, and the warm glow of brushed gold that reminds me of 
                autumn afternoons.
              </p>
              <p className="text-[#2C2C2C]/70 leading-relaxed">
                Whether you're drawn to an existing piece or interested in commissioning something 
                uniquely yours, I believe art should speak to you personally. It should transform 
                a space and create a feeling of connection every time you see it.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={artistImage}
                  alt="The Artist"
                  className="w-full aspect-square object-cover rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-[#D4AF37] rounded-lg -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-[#2C2C2C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg className="w-12 h-12 mx-auto text-[#D4AF37] mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <blockquote className="text-2xl md:text-3xl font-serif text-white leading-relaxed mb-6">
            "Art is not what you see, but what you make others see."
          </blockquote>
          <p className="text-white/60">— Edgar Degas</p>
        </div>
      </section>

      {/* Creative Process */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Behind the Canvas</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">My Creative Process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9B86BD] to-[#D4AF37] flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Observation</h3>
              <p className="text-[#2C2C2C]/60">
                Every piece begins with observation—noticing the play of light, the rhythm of a moment, 
                the emotion in a scene. I keep a visual journal of these inspirations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9B86BD] to-[#D4AF37] flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Exploration</h3>
              <p className="text-[#2C2C2C]/60">
                I experiment with color, texture, and composition through sketches and studies. 
                This phase is about discovery and allowing the piece to reveal itself.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9B86BD] to-[#D4AF37] flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Creation</h3>
              <p className="text-[#2C2C2C]/60">
                The final piece emerges through layers of paint, texture, and intention. 
                Each brushstroke is deliberate, building toward a work that resonates emotionally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Glimpse */}
      <section className="py-16 bg-gradient-to-br from-[#9B86BD]/10 to-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Recent Work</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C]">From the Studio</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artworks.slice(0, 8).map((artwork) => (
              <div 
                key={artwork.id}
                className="group cursor-pointer"
                onClick={() => setCurrentPage('gallery')}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#2C2C2C]/0 group-hover:bg-[#2C2C2C]/30 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage('gallery')}
              className="inline-flex items-center gap-2 text-[#2C2C2C] hover:text-[#9B86BD] transition-colors group"
            >
              <span className="text-sm tracking-wide uppercase">View Full Gallery</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education & Experience */}
            <div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-6 pb-3 border-b border-[#2C2C2C]/10">
                Education & Training
              </h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium text-[#2C2C2C]">MFA in Fine Arts</p>
                  <p className="text-sm text-[#2C2C2C]/60">Pacific Northwest College of Art, 2015</p>
                </li>
                <li>
                  <p className="font-medium text-[#2C2C2C]">BFA in Painting</p>
                  <p className="text-sm text-[#2C2C2C]/60">University of Oregon, 2012</p>
                </li>
                <li>
                  <p className="font-medium text-[#2C2C2C]">Artist Residency</p>
                  <p className="text-sm text-[#2C2C2C]/60">Vermont Studio Center, 2018</p>
                </li>
              </ul>
            </div>

            {/* Exhibitions */}
            <div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-6 pb-3 border-b border-[#2C2C2C]/10">
                Selected Exhibitions
              </h3>
              <ul className="space-y-4">
                <li>
                  <p className="font-medium text-[#2C2C2C]">"Light & Shadow" Solo Exhibition</p>
                  <p className="text-sm text-[#2C2C2C]/60">Portland Art Museum, 2024</p>
                </li>
                <li>
                  <p className="font-medium text-[#2C2C2C]">Pacific Northwest Artists Collective</p>
                  <p className="text-sm text-[#2C2C2C]/60">Seattle Art Fair, 2023</p>
                </li>
                <li>
                  <p className="font-medium text-[#2C2C2C]">"Emerging Voices" Group Show</p>
                  <p className="text-sm text-[#2C2C2C]/60">San Francisco Museum of Modern Art, 2022</p>
                </li>
                <li>
                  <p className="font-medium text-[#2C2C2C]">"Abstract Horizons"</p>
                  <p className="text-sm text-[#2C2C2C]/60">Froelick Gallery, Portland, 2021</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2C2C2C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Whether you're looking for an original piece, a beautiful print, or a custom commission, 
            I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('commission')}
              className="px-8 py-4 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors"
            >
              Start a Commission
            </button>
            <button
              onClick={() => setCurrentPage('shop')}
              className="px-8 py-4 border-2 border-[#9B86BD] text-[#9B86BD] font-medium tracking-wide uppercase hover:bg-[#9B86BD] hover:text-white transition-colors"
            >
              Shop Prints
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
