# Set Stripe Secret Key in Supabase

## Your Stripe Keys

✅ **Publishable Key** (already in code):
`pk_live_51SeXIyCX683y2w3XjIyq03YzQ95bspyRUuJr4L5hy39sy1SgrZhFokERGjmSIhXHagjfYcjbFZxMnf36XWpEn5tJ007lk9GTbQ`

🔑 **Secret Key** (set this in Supabase):
`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`

## Quick Setup Steps

### 1. Deploy the Edge Function

**Via Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Edge Functions** (left sidebar)
4. Click **Create a new function**
5. Name: `create-checkout-session`
6. Copy ALL code from: `supabase/functions/create-checkout-session/index.ts`
7. Paste into the editor
8. Click **Deploy**

### 2. Set the Secrets

1. In Supabase Dashboard, go to **Settings** → **Edge Functions** → **Secrets**
2. Click **Add secret**

**Secret 1:**
- Name: `STRIPE_SECRET_KEY`
- Value: `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`
- Click **Save**

**Secret 2:**
- Name: `SITE_URL`
- Value: `http://localhost:8080` (for testing)
- For production, change to: `https://yourdomain.com`
- Click **Save**

### 3. Test It!

1. Go to your website: `http://localhost:8080`
2. Add items to cart
3. Click "Proceed to Checkout"
4. Fill in customer information
5. Click "Complete Order"
6. You should be redirected to Stripe's payment page
7. Use test card: `4242 4242 4242 4242` (any future date, any CVC)

## ✅ That's It!

Once you set the secrets, your payment system will be fully functional!

---

**Note:** Since you're using live keys (`sk_live_` and `pk_live_`), these are for REAL payments. Make sure you're ready for production, or switch to test keys for testing.

