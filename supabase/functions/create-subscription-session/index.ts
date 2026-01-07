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
    const { customer_email, price_id } = await req.json()

    // Validate price_id is provided
    if (!price_id) {
      return new Response(
        JSON.stringify({ error: 'Price ID is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create Stripe Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id, // Use the price ID from your Stripe product
          quantity: 1,
        },
      ],
      mode: 'subscription', // Subscription mode
      customer_email: customer_email,
      // @ts-ignore - Deno global
      success_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      // @ts-ignore - Deno global
      cancel_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/membership`,
      metadata: {
        type: 'membership',
        product: 'majesties',
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

