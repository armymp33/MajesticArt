# Deploy Stripe Function in Supabase Browser - Step by Step

## Step 1: Create the Function

1. Go to: https://supabase.com/dashboard
2. Select your project (rlbhwudztyezkavypiol)
3. Click **Edge Functions** in the left sidebar
4. Click **Create a new function** button
5. Name it: `create-checkout-session` (exactly this name)
6. Click **Create function**

## Step 2: Add the Code

Copy and paste this ENTIRE code into the function editor:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"

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
      success_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
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
```

7. Click **Deploy** button (top right)

## Step 3: Set Secrets

1. In Supabase Dashboard, go to **Settings** (gear icon) → **Edge Functions** → **Secrets** tab
2. Click **Add secret** button

**Add Secret 1:**
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: `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`
- Click **Save**

**Add Secret 2:**
- Click **Add secret** again
- **Name**: `SITE_URL`
- **Value**: `http://localhost:8080`
- Click **Save**

## Step 4: Test It!

1. Go to your website: `http://localhost:8080`
2. Add items to cart
3. Click "Proceed to Checkout"
4. Fill in customer info
5. Click "Complete Order"
6. You should be redirected to Stripe's payment page! 🎉

## ✅ Done!

Your payment system is now live! Customers can pay with:
- Credit/Debit cards
- Google Pay
- Apple Pay
- And more payment methods Stripe supports

---

**Troubleshooting:**
- If function not found: Make sure it's named exactly `create-checkout-session`
- If secret error: Make sure both secrets are set
- If payment fails: Check Stripe Dashboard → Payments for errors

