// @ts-ignore - Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore - Deno types
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"

// @ts-ignore - Deno global
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items, customer_email, shipping_address } = await req.json()

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.artwork_title} - ${item.product_type} (${item.size})`,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer_email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add more countries as needed
      },
      // @ts-ignore - Deno global
      success_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // @ts-ignore - Deno global
      cancel_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/checkout/cancel`,
      metadata: {
        shipping_address: shipping_address,
        items: JSON.stringify(items),
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

