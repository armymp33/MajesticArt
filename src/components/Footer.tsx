import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
interface FooterProps {
  setCurrentPage: (page: string) => void;
  openNewsletter: () => void;
}
const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  openNewsletter
}) => {
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubmitted, setFooterSubmitted] = useState(false);
  const [footerError, setFooterError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFooterError('');
    if (!footerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerEmail)) {
      setFooterError('Please enter a valid email');
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error: dbError
      } = await supabase.from('newsletter_subscribers').insert({
        email: footerEmail
      });
      if (dbError) {
        if (dbError.code === '23505') {
          setFooterError('Already subscribed!');
          return;
        }
        throw dbError;
      }
      setFooterSubmitted(true);
      setFooterEmail('');
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setFooterError('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <footer className="bg-[#2C2C2C] text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-serif mb-2">Stay Connected</h3>
              <p className="text-white/60">Get 10% off your first order when you subscribe</p>
            </div>
            {!footerSubmitted ? <form onSubmit={handleFooterSubscribe} className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <div className="flex-1 md:w-64">
                  <input type="email" value={footerEmail} onChange={e => setFooterEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]" />
                  {footerError && <p className="text-red-400 text-xs mt-1">{footerError}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors whitespace-nowrap disabled:opacity-50">
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form> : <p className="text-[#D4AF37] font-medium">Thank you for subscribing!</p>}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[#D4AF37]/20">
                <img src="/japanese-imperial-te.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-serif">Majestic Art Studio</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Creating contemporary abstract art that speaks to the soul. Each piece is crafted with intention and passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9B86BD] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9B86BD] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9B86BD] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-6 text-[#D4AF37]">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="text-white/60 hover:text-white transition-colors">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="text-white/60 hover:text-white transition-colors">
                  Shop
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('commission')} className="text-white/60 hover:text-white transition-colors">
                  Commission
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="text-white/60 hover:text-white transition-colors">
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-6 text-[#D4AF37]">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Shipping & Returns</a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Care Instructions</a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium tracking-wide uppercase mb-6 text-[#D4AF37]">Get in Touch</h4>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@lineandlight.studio</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Portland, Oregon</span>
              </li>
            </ul>
            <button onClick={openNewsletter} className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E5C048] transition-colors">
              <span>Join Newsletter</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>&copy; 2024 Line & Light Studio. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;