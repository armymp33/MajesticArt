import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateCheckout = () => {
    const newErrors: Record<string, string> = {};
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!customerInfo.address.trim()) newErrors.address = 'Shipping address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateCheckout()) return;

    setIsProcessing(true);
    try {
      // Create Stripe Checkout Session via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          shipping_address: customerInfo.address,
          items: items.map(item => ({
            artwork_id: item.artworkId,
            artwork_title: item.title,
            product_type: item.productType,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image
          }))
        }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Redirect directly to Stripe Checkout URL (new method)
        window.location.href = data.url;
      } else if (data?.sessionId) {
        // Fallback: if only sessionId is provided, construct the URL
        // This shouldn't happen with current implementation, but keeping as backup
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      } else {
        throw new Error('No checkout URL or session ID returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error?.message || 'There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCheckoutStep('cart');
    setCustomerInfo({ name: '', email: '', address: '' });
    setErrors({});
    setOrderId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#2C2C2C]/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#FAF9F6] shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#2C2C2C]/10">
            <h2 className="text-xl font-serif text-[#2C2C2C]">
              {checkoutStep === 'cart' && 'Your Cart'}
              {checkoutStep === 'checkout' && 'Checkout'}
              {checkoutStep === 'success' && 'Order Confirmed'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-[#2C2C2C] hover:text-[#9B86BD] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success State */}
          {checkoutStep === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37] flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-[#2C2C2C] mb-3">Thank You!</h3>
              <p className="text-[#2C2C2C]/60 mb-2">Your order has been confirmed.</p>
              {orderId && (
                <p className="text-sm text-[#2C2C2C]/40 mb-6">
                  Order #{orderId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <p className="text-[#2C2C2C]/60 mb-8">
                A confirmation email has been sent to {customerInfo.email}
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-[#9B86BD] text-white font-medium tracking-wide uppercase hover:bg-[#8A75AC] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* Checkout Form */}
          {checkoutStep === 'checkout' && (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors mb-6"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to cart
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C2C2C] mb-2">Shipping Address *</label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      rows={3}
                      className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-[#2C2C2C]/20'} rounded focus:outline-none focus:border-[#9B86BD] transition-colors resize-none`}
                      placeholder="Street address, city, state, zip code"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-8 p-4 bg-white rounded border border-[#2C2C2C]/10">
                  <h4 className="font-medium text-[#2C2C2C] mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-[#2C2C2C]/70">
                        <span>{item.title} ({item.size}) x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-[#2C2C2C]/10 pt-2 mt-2 flex justify-between font-medium text-[#2C2C2C]">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#2C2C2C]/10 p-6">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#D4AF37] text-white font-medium tracking-wide uppercase hover:bg-[#B8963A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Complete Order - $${totalPrice.toFixed(2)}`
                  )}
                </button>
              </div>
            </>
          )}

          {/* Cart Items */}
          {checkoutStep === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-[#2C2C2C]/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-[#2C2C2C]/60">Your cart is empty</p>
                    <button
                      onClick={handleClose}
                      className="mt-4 text-[#9B86BD] hover:text-[#D4AF37] transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-[#2C2C2C]">{item.title}</h3>
                          <p className="text-sm text-[#2C2C2C]/60">
                            {item.productType} - {item.size}
                          </p>
                          <p className="text-sm font-medium text-[#D4AF37]">${item.price}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded border border-[#2C2C2C]/20 flex items-center justify-center hover:border-[#9B86BD] transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded border border-[#2C2C2C]/20 flex items-center justify-center hover:border-[#9B86BD] transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-[#2C2C2C]/40 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-[#2C2C2C]/10 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2C2C2C]/60">Subtotal</span>
                    <span className="text-xl font-serif text-[#2C2C2C]">${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[#2C2C2C]/40">Shipping calculated at checkout</p>
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full py-4 bg-[#D4AF37] text-white font-medium tracking-wide uppercase hover:bg-[#B8963A] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full py-3 text-[#2C2C2C] text-sm hover:text-[#9B86BD] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
