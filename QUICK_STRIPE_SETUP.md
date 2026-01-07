# Quick Stripe Setup - Step by Step

## ⚠️ Important: Check Your Secret Key

Your secret key starts with `mk_` which is unusual. Stripe secret keys should start with:
- `sk_test_...` (for testing)
- `sk_live_...` (for production)

**To get the correct secret key:**
1. Go to https://dashboard.stripe.com
2. Click **Developers** → **API keys**
3. Look for **Secret key** (not publishable key)
4. It should start with `sk_live_` or `sk_test_`
5. Copy that key

## Deploy the Payment Function

### Method 1: Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Create Edge Function**
   - Click **Edge Functions** (left sidebar)
   - Click **Create a new function**
   - Name: `create-checkout-session`
   - Click **Create function**

3. **Add the Code**
   - Open the file: `supabase/functions/create-checkout-session/index.ts`
   - Copy ALL the code
   - Paste it into the Supabase function editor
   - Click **Deploy**

4. **Set Secrets**
   - Go to **Settings** → **Edge Functions** → **Secrets**
   - Click **Add secret**
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key (should start with `sk_live_` or `sk_test_`)
   - Click **Save**
   
   - Add another secret:
   - Name: `SITE_URL`
   - Value: `http://localhost:8080` (for testing)
   - Click **Save**

5. **Test It!**
   - Go to your website
   - Add items to cart
   - Click "Proceed to Checkout"
   - Fill in info and click "Complete Order"
   - You should be redirected to Stripe payment page

## Your Current Keys

✅ **Publishable Key** (already set in code):
`pk_live_51SeXIyCX683y2w3XjIyq03YzQ95bspyRUuJr4L5hy39sy1SgrZhFokERGjmSIhXHagjfYcjbFZxMnf36XWpEn5tJ007lk9GTbQ`

🔑 **Secret Key** (needs to be set in Supabase):
`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`

## What Happens When Customer Pays

1. Customer adds items to cart
2. Clicks "Proceed to Checkout" → fills in info
3. Clicks "Complete Order"
4. Your site calls the Edge Function
5. Edge Function creates Stripe Checkout Session
6. Customer redirected to Stripe's secure payment page
7. Customer pays (card, Google Pay, Apple Pay, etc.)
8. Stripe redirects to success page

## Test Cards

For testing (use test mode keys):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date, any CVC

---

**Need help?** Make sure:
- ✅ Edge Function is deployed
- ✅ Secrets are set in Supabase
- ✅ Secret key starts with `sk_live_` or `sk_test_`
- ✅ Function name is exactly: `create-checkout-session`

