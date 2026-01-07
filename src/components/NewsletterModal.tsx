import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (dbError) {
        if (dbError.code === '23505') {
          // Unique constraint violation - email already exists
          setError('This email is already subscribed!');
          return;
        }
        throw dbError;
      }

      // Send welcome email (don't wait for it - fire and forget)
      supabase.functions.invoke('send-newsletter-welcome', {
        body: { email },
      }).catch(err => {
        console.error('Failed to send welcome email:', err);
        // Don't show error to user - subscription still succeeded
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2C2C2C]/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-[#FAF9F6] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <div className="p-8 md:p-12">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9B86BD] to-[#D4AF37] flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif text-[#2C2C2C] text-center mb-3">
              Join the Studio
            </h2>
            <p className="text-[#2C2C2C]/60 text-center mb-2">
              Get exclusive access to new releases, behind-the-scenes content, and special offers.
            </p>
            <p className="text-[#D4AF37] text-center text-sm font-medium mb-8">
              Plus, enjoy 10% off your first order!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white border border-[#2C2C2C]/10 rounded focus:outline-none focus:border-[#9B86BD] transition-colors text-[#2C2C2C]"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2C2C2C] text-white font-medium tracking-wide uppercase hover:bg-[#9B86BD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe & Save 10%'
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-[#2C2C2C]/40 text-center">
              By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-3">
              Welcome to the Studio!
            </h2>
            <p className="text-[#2C2C2C]/60 mb-6">
              Check your inbox for your 10% discount code. We're so excited to have you!
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-[#9B86BD] text-white font-medium tracking-wide uppercase hover:bg-[#8A75AC] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;
