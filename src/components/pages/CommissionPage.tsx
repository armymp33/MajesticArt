import React, { useState } from 'react';
import { commissionTiers } from '@/data/artworks';
import { supabase } from '@/lib/supabase';

interface CommissionPageProps {
  setCurrentPage: (page: string) => void;
}

const CommissionPage: React.FC<CommissionPageProps> = ({ setCurrentPage }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tier: '',
    size: '',
    description: '',
    timeline: '',
    budget: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commissionId, setCommissionId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.tier) errors.tier = 'Please select a tier';
    if (!formData.description.trim()) errors.description = 'Please describe your vision';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-commission', {
        body: {
          customer_name: formData.name,
          customer_email: formData.email,
          tier: formData.tier,
          preferred_size: formData.size || null,
          description: formData.description,
          timeline: formData.timeline || null,
          budget: formData.budget || null
        }
      });

      if (error) throw error;

      if (data?.success) {
        setCommissionId(data.commission_id);
        setFormSubmitted(true);
      } else {
        throw new Error(data?.error || 'Failed to submit commission request');
      }
    } catch (error) {
      console.error('Commission submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setFormData(prev => ({ ...prev, tier: tierId }));
    // Scroll to form
    document.getElementById('commission-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pt-20 min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#9B86BD]/10 to-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm mb-3">Custom Artwork</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C] mb-6">Commission Me</h1>
          <p className="text-[#2C2C2C]/60 max-w-2xl mx-auto">
            Let's create something extraordinary together. Commission a custom piece tailored to your vision, 
            space, and style.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Inquiry', desc: 'Fill out the form below with your vision and preferences.' },
              { step: '02', title: 'Consultation', desc: 'We\'ll discuss your ideas, space, and artistic direction.' },
              { step: '03', title: 'Creation', desc: 'I\'ll bring your vision to life with regular progress updates.' },
              { step: '04', title: 'Delivery', desc: 'Your custom piece arrives ready to display and enjoy.' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2C2C2C] flex items-center justify-center">
                  <span className="text-[#D4AF37] font-serif text-lg">{item.step}</span>
                </div>
                <h3 className="font-serif text-lg text-[#2C2C2C] mb-2">{item.title}</h3>
                <p className="text-sm text-[#2C2C2C]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-4">Commission Tiers</h2>
            <p className="text-[#2C2C2C]/60">Choose the tier that best fits your project</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {commissionTiers.map((tier) => (
              <div 
                key={tier.id}
                className={`relative p-8 border transition-all ${
                  tier.popular 
                    ? 'border-[#D4AF37] shadow-lg' 
                    : 'border-[#2C2C2C]/10 hover:border-[#9B86BD]'
                } ${selectedTier === tier.id ? 'ring-2 ring-[#9B86BD]' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-[#2C2C2C] text-xs font-medium tracking-wide uppercase">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-serif text-[#2C2C2C] mb-2">{tier.name}</h3>
                  <p className="text-3xl font-serif text-[#D4AF37]">{tier.price}</p>
                  <p className="text-sm text-[#2C2C2C]/60 mt-2">{tier.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-[#2C2C2C]/80">
                      <svg className="w-5 h-5 text-[#9B86BD] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="text-center text-sm text-[#2C2C2C]/60 mb-6">
                  Delivery: {tier.deliveryTime}
                </div>

                <button
                  onClick={() => selectTier(tier.id)}
                  className={`w-full py-3 font-medium tracking-wide uppercase transition-colors ${
                    tier.popular
                      ? 'bg-[#D4AF37] text-[#2C2C2C] hover:bg-[#B8963A]'
                      : 'bg-[#2C2C2C] text-white hover:bg-[#9B86BD]'
                  }`}
                >
                  Select {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Form */}
      <section id="commission-form" className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-[#2C2C2C] mb-4">Start Your Commission</h2>
            <p className="text-[#2C2C2C]/60">
              Tell me about your vision and I'll get back to you within 48 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 bg-white border border-[#2C2C2C]/10 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[#2C2C2C] mb-3">Thank You!</h3>
              {commissionId && (
                <p className="text-sm text-[#2C2C2C]/40 mb-3">
                  Reference: #{commissionId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <p className="text-[#2C2C2C]/60 mb-2">
                Your commission inquiry has been received.
              </p>
              <p className="text-[#2C2C2C]/60 mb-6">
                A confirmation email has been sent to {formData.email}. I'll review your request and get back to you within 48 hours.
              </p>
              <button
                onClick={() => setCurrentPage('gallery')}
                className="px-6 py-3 bg-[#9B86BD] text-white font-medium tracking-wide uppercase hover:bg-[#8A75AC] transition-colors"
              >
                Browse Gallery
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 border border-[#2C2C2C]/10 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors`}
                    placeholder="Your name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Commission Tier *</label>
                  <select
                    name="tier"
                    value={formData.tier}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.tier ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors`}
                  >
                    <option value="">Select a tier</option>
                    {commissionTiers.map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.name} - {tier.price}</option>
                    ))}
                  </select>
                  {formErrors.tier && <p className="mt-1 text-sm text-red-500">{formErrors.tier}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Preferred Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded focus:outline-none focus:border-[#9B86BD] transition-colors"
                    placeholder="e.g., 24x36 inches"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Describe Your Vision *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 border ${formErrors.description ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors resize-none`}
                  placeholder="Tell me about the piece you envision. Include details about colors, mood, style, and where it will be displayed..."
                />
                {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded focus:outline-none focus:border-[#9B86BD] transition-colors"
                  >
                    <option value="">Select timeline</option>
                    <option value="flexible">Flexible</option>
                    <option value="1-2months">1-2 months</option>
                    <option value="3-4months">3-4 months</option>
                    <option value="specific">Specific date (mention in description)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded focus:outline-none focus:border-[#9B86BD] transition-colors"
                  >
                    <option value="">Select budget</option>
                    <option value="350-500">$350 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000+">$2,000+</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#D4AF37] text-[#2C2C2C] font-medium tracking-wide uppercase hover:bg-[#B8963A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#2C2C2C]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-serif text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'How long does a commission take?',
                a: 'Depending on the tier and complexity, commissions typically take 2-8 weeks. I\'ll provide a more accurate timeline during our consultation.'
              },
              {
                q: 'What if I\'m not happy with the result?',
                a: 'Your satisfaction is my priority. Each tier includes revision rounds, and I provide progress updates throughout the process to ensure we\'re aligned on the vision.'
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes! I ship worldwide. International shipping costs will be calculated based on the size and destination of your piece.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'I accept credit cards, PayPal, and bank transfers. A 50% deposit is required to begin work, with the balance due upon completion.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-6">
                <h3 className="text-lg font-medium text-white mb-2">{faq.q}</h3>
                <p className="text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommissionPage;
