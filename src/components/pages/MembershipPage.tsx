import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';

interface MembershipPageProps {
  setCurrentPage: (page: string) => void;
}

const MembershipPage: React.FC<MembershipPageProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Your Majesties membership Price ID from Stripe
  const MEMBERSHIP_PRICE_ID = 'price_1SkKOoCX683y2w3XoODNB1C1';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Create subscription checkout session
      const { data, error: sessionError } = await supabase.functions.invoke('create-subscription-session', {
        body: {
          customer_email: email,
          price_id: MEMBERSHIP_PRICE_ID,
        },
      });

      if (sessionError) {
        throw new Error(sessionError.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to start subscription. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-[#9B86BD]/10 to-[#D4AF37]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C2C2C] mb-6">
            Majesties
          </h1>
          <p className="text-xl md:text-2xl text-[#2C2C2C]/80 mb-4">
            The Official Majestic Art Fan Club
          </p>
          <p className="text-lg text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Your all-access pass into the inner circle of Majestic Art. Experience every new creation three days before the public — with the power to view, reserve, and purchase upcoming artwork before anyone else.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-[#2C2C2C] text-center mb-12">
            Membership Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#2C2C2C]/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Early Access</h3>
              <p className="text-[#2C2C2C]/60">
                See every new creation three days before the public release.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#2C2C2C]/10">
              <div className="w-12 h-12 bg-[#9B86BD]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#9B86BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Exclusive Access</h3>
              <p className="text-[#2C2C2C]/60">
                View, reserve, and purchase upcoming artwork before anyone else.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#2C2C2C]/10">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Inner Circle</h3>
              <p className="text-[#2C2C2C]/60">
                Step behind the curtain and join the exclusive Majestic Art community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-16 bg-[#2C2C2C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-serif text-[#2C2C2C] text-center mb-6">
              Join Majesties Today
            </h2>
            <p className="text-[#2C2C2C]/60 text-center mb-8">
              Start your membership and get exclusive access to new artwork before anyone else.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded focus:outline-none focus:border-[#9B86BD] transition-colors"
                  placeholder="your@email.com"
                  required
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#E5C048] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Start Membership'
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-[#2C2C2C]/40 text-center">
              By subscribing, you agree to our terms of service. You can cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembershipPage;

