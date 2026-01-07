import MembershipPage from '@/components/pages/MembershipPage';
import { Artwork } from '@/data/artworks';
import React, { useState } from 'react';
import CartModal from './CartModal';
import Footer from './Footer';
import Navigation from './Navigation';
import NewsletterModal from './NewsletterModal';
import AboutPage from './pages/AboutPage';
import CommissionPage from './pages/CommissionPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';

const AppLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'gallery':
        return <GalleryPage setCurrentPage={handlePageChange} setSelectedArtwork={setSelectedArtwork} />;
      case 'shop':
        return <ShopPage selectedArtwork={selectedArtwork} setSelectedArtwork={setSelectedArtwork} searchQuery={searchQuery} />;
      case 'commission':
        return <CommissionPage setCurrentPage={handlePageChange} />;
      case 'about':
        return <AboutPage setCurrentPage={handlePageChange} />;
      case 'membership':
        return <MembershipPage setCurrentPage={handlePageChange} />;
      default:
        return <HomePage setCurrentPage={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={handlePageChange}
        openCart={() => setCartOpen(true)}
        openNewsletter={() => setNewsletterOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main>
        {renderPage()}
      </main>

      <Footer 
        setCurrentPage={handlePageChange}
        openNewsletter={() => setNewsletterOpen(true)}
      />

      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
      />

      <NewsletterModal 
        isOpen={newsletterOpen} 
        onClose={() => setNewsletterOpen(false)} 
      />
    </div>
  );
};

export default AppLayout;
