import { useCart } from '@/contexts/CartContext';
import { getAssetPath } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openCart: () => void;
  openNewsletter: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}
const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  openCart,
  openNewsletter,
  searchQuery = '',
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const {
    totalItems
  } = useCart();

  // Sync local search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(localSearchQuery);
      setCurrentPage('shop');
    }
  };
  const navLinks = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'gallery',
    label: 'Gallery'
  }, {
    id: 'shop',
    label: 'Shop'
  }, {
    id: 'commission',
    label: 'Commission'
  }, {
    id: 'membership',
    label: 'Majesties'
  }, {
    id: 'about',
    label: 'About'
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#2C2C2C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[#D4AF37]/20">
              <img src={getAssetPath('/japanese-imperial-te.png')} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-serif text-[#2C2C2C] group-hover:text-[#9B86BD] transition-colors">Majestic Art</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => <button key={link.id} onClick={() => setCurrentPage(link.id)} className={`relative text-sm tracking-wide uppercase transition-colors ${currentPage === link.id ? 'text-[#9B86BD]' : 'text-[#2C2C2C] hover:text-[#9B86BD]'}`}>
                {link.label}
                {currentPage === link.id && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]" />}
              </button>)}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Search art..."
                className="w-48 px-4 py-2 pl-10 text-sm bg-white border border-[#2C2C2C]/20 text-[#2C2C2C] placeholder-[#2C2C2C]/40 focus:outline-none focus:border-[#9B86BD] transition-colors"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Newsletter */}
            <button onClick={openNewsletter} className="hidden sm:flex items-center text-sm text-[#2C2C2C] hover:text-[#9B86BD] transition-colors">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Subscribe
            </button>

            {/* Cart */}
            <button onClick={openCart} className="relative p-2 text-[#2C2C2C] hover:text-[#9B86BD] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>}
            </button>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#2C2C2C]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && <div className="md:hidden py-4 border-t border-[#2C2C2C]/10">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search art..."
                  className="w-full px-4 py-2 pl-10 text-sm bg-white border border-[#2C2C2C]/20 text-[#2C2C2C] placeholder-[#2C2C2C]/40 focus:outline-none focus:border-[#9B86BD] transition-colors"
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/40" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            {navLinks.map(link => <button key={link.id} onClick={() => {
          setCurrentPage(link.id);
          setMobileMenuOpen(false);
        }} className={`block w-full text-left py-3 px-2 text-sm tracking-wide uppercase ${currentPage === link.id ? 'text-[#9B86BD] bg-[#9B86BD]/5' : 'text-[#2C2C2C]'}`}>
                {link.label}
              </button>)}
            <button onClick={() => {
          openNewsletter();
          setMobileMenuOpen(false);
        }} className="block w-full text-left py-3 px-2 text-sm tracking-wide uppercase text-[#2C2C2C]">
              Subscribe to Newsletter
            </button>
          </div>}
      </div>
    </nav>;
};
export default Navigation;