# Deploy Stripe Payment Function - Quick Guide

## Your Stripe Keys
- ✅ Publishable Key: Already set in `src/lib/stripe.ts`
- 🔑 Secret Key: `mk_1SeXJACX683y2w3XbIjljtMc` (Note: This looks like a restricted key. If it doesn't work, get the full secret key from Stripe Dashboard)

## Deploy via Supabase Dashboard (Easiest Method)

### Step 1: Create the Edge Function
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Edge Functions** in the left sidebar
4. Click **Create a new function**
5. Name it: `create-checkout-session`
6. Click **Create function**

### Step 2: Add the Code
1. In the function editor, delete any default code
2. Copy ALL the code from: `supabase/functions/create-checkout-session/index.ts`
3. Paste it into the editor
4. Click **Deploy**

### Step 3: Set Secrets
1. In Supabase Dashboard, go to **Settings** → **Edge Functions** → **Secrets**
2. Add these secrets:

**Secret 1:**
- Name: `STRIPE_SECRET_KEY`
- Value: `mk_1SeXJACX683y2w3XbIjljtMc`

**Secret 2:**
- Name: `SITE_URL`
- Value: `http://localhost:8080` (for testing)
- For production, use: `https://yourdomain.com`

3. Click **Save** for each secret

### Step 4: Test It!
1. Go to your website
2. Add items to cart
3. Click "Proceed to Checkout"
4. Fill in customer info
5. Click "Complete Order"
6. You should be redirected to Stripe's payment page

## ⚠️ Important Note About Secret Key

Your secret key starts with `mk_` which is unusual. Stripe secret keys typically start with:
- `sk_test_...` (for testing)
- `sk_live_...` (for production)

If you get errors, check your Stripe Dashboard:
1. Go to **Developers** → **API keys**
2. Make sure you're copying the **Secret key** (not the publishable key)
3. It should start with `sk_live_` or `sk_test_`

## Alternative: Deploy via CLI

If you prefer using the command line:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref rlbhwudztyezkavypiol

# Set the secrets
supabase secrets set STRIPE_SECRET_KEY=mk_1SeXJACX683y2w3XbIjljtMc
supabase secrets set SITE_URL=http://localhost:8080

# Deploy the function
supabase functions deploy create-checkout-session
```

## Test Cards (for testing)

If using test mode:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date, any CVC

## Troubleshooting

**"Function not found" error:**
- Make sure the function is deployed and named exactly `create-checkout-session`

**"Invalid API key" error:**
- Check that your secret key is correct
- Make sure it starts with `sk_live_` or `sk_test_`
- If it starts with `mk_`, you might need the full secret key from Stripe Dashboard

**"Secret not set" error:**
- Make sure you set both secrets in Supabase Dashboard

---

Once deployed, your payment system will be fully functional! 🎉

