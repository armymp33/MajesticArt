// @ts-ignore - Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore - Deno types
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"

// @ts-ignore - Deno global
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// @ts-ignore - Deno global
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

// Fulfillment function - handles order fulfillment
async function fulfillCheckout(sessionId: string) {
  console.log(`Fulfilling Checkout Session ${sessionId}`)

  try {
    // TODO: Check if this session has already been fulfilled
    // You can store fulfillment status in your database
    
    // Retrieve the Checkout Session with line items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    // Check payment status
    if (checkoutSession.payment_status === 'paid') {
      console.log('Payment confirmed, fulfilling order...')

      // TODO: Perform fulfillment actions here:
      // - Save order to your database
      // - Send confirmation email
      // - Update inventory
      // - Trigger shipping
      // - Grant access to services
      
      // Example: Save order to Supabase database
      // You'll need to create an 'orders' table first
      /*
      const { supabase } = await import('@supabase/supabase-js')
      const supabaseClient = supabase.createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      )
      
      await supabaseClient.from('orders').insert({
        session_id: sessionId,
        customer_email: checkoutSession.customer_email,
        amount_total: checkoutSession.amount_total,
        currency: checkoutSession.currency,
        payment_status: checkoutSession.payment_status,
        line_items: checkoutSession.line_items,
        fulfilled: true,
        fulfilled_at: new Date().toISOString(),
      })
      */

      console.log(`Order ${sessionId} fulfilled successfully`)
      return { success: true, sessionId }
    } else {
      console.log(`Payment not completed for session ${sessionId}, status: ${checkoutSession.payment_status}`)
      return { success: false, reason: 'Payment not completed' }
    }
  } catch (error: any) {
    console.error(`Error fulfilling checkout ${sessionId}:`, error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'No signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the raw body
    const body = await req.text()

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle the event
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object as any
      await fulfillCheckout(session.id)
    }

    // Return success
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

