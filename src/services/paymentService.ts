import { stripePromise } from '@/lib/stripe';

export interface CheckoutItem {
  artworkId: string;
  title: string;
  productType: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
}

// Create Stripe Checkout Session
// Note: In production, this should be done on your backend for security
// For now, this is a client-side approach - you'll need to create a backend endpoint later
export const createCheckoutSession = async (
  items: CheckoutItem[],
  customerInfo: CustomerInfo,
  totalPrice: number
): Promise<string | null> => {
  try {
    // In production, call your backend API to create the checkout session
    // For now, we'll use a simple approach with Stripe Checkout
    
    // You'll need to create a backend endpoint that:
    // 1. Creates a Stripe Checkout Session
    // 2. Returns the session URL
    // 3. Uses your Stripe secret key (never expose this in frontend code!)
    
    // Temporary: Using Supabase Edge Function or you can create a simple Node.js/Express backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.title} - ${item.productType} (${item.size})`,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        customer_email: customerInfo.email,
        shipping_address: customerInfo.address,
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Fallback: For now, we'll handle payment differently
    return null;
  }
};

// Alternative: Direct Stripe Checkout redirect (simpler, but requires backend)
export const redirectToStripeCheckout = async (
  items: CheckoutItem[],
  customerInfo: CustomerInfo,
  totalPrice: number
) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.title} - ${item.productType} (${item.size})`,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Note: This requires a backend endpoint to create the session securely
    // For now, we'll use a workaround with Supabase Edge Function
    const { data, error } = await fetch('/api/stripe/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        line_items: lineItems,
        customer_email: customerInfo.email,
        mode: 'payment',
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
      }),
    }).then(r => r.json());

    if (error) throw error;

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

