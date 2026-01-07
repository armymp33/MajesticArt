# Order Fulfillment Setup Guide

## ✅ What's Been Set Up

1. ✅ Webhook handler Edge Function (`stripe-webhook`)
2. ✅ Fulfillment service for React app
3. ✅ Success page triggers fulfillment
4. ✅ Orders table SQL schema

## 🔧 Setup Steps

### Step 1: Create Orders Table

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy and paste the SQL from `CREATE_ORDERS_TABLE.sql`
3. Click **Run**

This creates a table to store order information.

### Step 2: Deploy Webhook Handler

1. Go to Supabase Dashboard → **Edge Functions**
2. Click **Create a new function**
3. Name: `stripe-webhook`
4. Copy ALL code from: `supabase/functions/stripe-webhook/index.ts`
5. Paste and click **Deploy**

### Step 3: Get Webhook Secret from Stripe

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint** (or use existing)
3. Set endpoint URL: `https://rlbhwudztyezkavypiol.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 4: Set Webhook Secret in Supabase

1. In Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**
2. Add secret:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: Your webhook secret from Stripe (`whsec_...`)
3. Click **Save**

### Step 5: Update Fulfillment Function (Optional)

Edit `supabase/functions/stripe-webhook/index.ts` and uncomment the database code to save orders:

```typescript
// Uncomment this section in the fulfillCheckout function
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
)

await supabaseClient.from('orders').insert({
  session_id: sessionId,
  customer_email: checkoutSession.customer_email,
  amount_total: checkoutSession.amount_total / 100, // Convert from cents
  currency: checkoutSession.currency,
  payment_status: checkoutSession.payment_status,
  line_items: checkoutSession.line_items,
  fulfilled: true,
  fulfilled_at: new Date().toISOString(),
})
```

You'll also need to add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as secrets.

## 🎯 How It Works

1. **Customer pays** → Stripe processes payment
2. **Webhook fires** → Stripe sends `checkout.session.completed` to your webhook
3. **Fulfillment triggered** → Your webhook handler fulfills the order
4. **Customer redirected** → Lands on success page
5. **Success page** → Also triggers fulfillment (for immediate response)
6. **Order saved** → Stored in your database

## 🔒 Why Both Webhooks and Landing Page?

- **Webhooks**: Most reliable - Stripe retries if delivery fails
- **Landing Page**: Immediate - Customer gets instant confirmation

Both trigger fulfillment, but webhooks ensure it happens even if customer doesn't visit the success page.

## 📝 Customize Fulfillment

Edit `fulfillCheckout` function in `stripe-webhook/index.ts` to:

- Send custom email confirmations
- Update inventory/stock
- Trigger shipping labels
- Grant access to digital products
- Create user accounts
- Send notifications

## 🧪 Test Locally

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:8080/webhook`
3. Copy the webhook secret it gives you
4. Test a payment
5. Check logs for fulfillment

## ✅ Done!

Your orders will now be automatically fulfilled when customers pay!

