# Stripe Payment Setup Guide

## ✅ What's Been Set Up

1. ✅ Stripe dependencies installed
2. ✅ Stripe configuration file created
3. ✅ Cart checkout updated to use Stripe
4. ✅ Supabase Edge Function created for secure payment processing

## 🔧 What You Need to Do

### Step 1: Get Your Stripe Secret Key

1. Go to your Stripe Dashboard: https://dashboard.stripe.com
2. Click on **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_live_...` or `sk_test_...`)
   - Use `sk_test_...` for testing
   - Use `sk_live_...` for production

### Step 2: Deploy the Supabase Edge Function

1. **Install Supabase CLI** (if you haven't):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref rlbhwudztyezkavypiol
   ```

4. **Set your Stripe secret key**:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
   ```

5. **Set your site URL** (for redirects):
   ```bash
   supabase secrets set SITE_URL=http://localhost:8080
   ```
   (For production, use your actual domain: `https://yourdomain.com`)

6. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy create-checkout-session
   ```

### Step 3: Test It!

1. Add items to your cart on the website
2. Click "Proceed to Checkout"
3. Fill in customer information
4. Click "Complete Order"
5. You should be redirected to Stripe's secure payment page
6. Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)

## 🎯 How It Works

1. Customer adds items to cart
2. Customer clicks "Proceed to Checkout" and fills in info
3. Customer clicks "Complete Order"
4. Your site calls the Supabase Edge Function
5. Edge Function creates a Stripe Checkout Session
6. Customer is redirected to Stripe's secure payment page
7. Customer pays with card, Google Pay, Apple Pay, etc.
8. Stripe redirects back to your success page

## 🔒 Security Notes

- ✅ Your Stripe secret key is stored securely in Supabase (never exposed to frontend)
- ✅ Payment processing happens on Stripe's secure servers
- ✅ Customer payment info never touches your servers

## 📝 Next Steps (Optional)

### Add Success/Cancel Pages

Create these pages to handle redirects:
- `/checkout/success` - Show order confirmation
- `/checkout/cancel` - Let customer know payment was cancelled

### Save Orders to Database

After successful payment, you can:
1. Use Stripe webhooks to save orders to your database
2. Send order confirmation emails
3. Update inventory

## 🆘 Troubleshooting

**"Function not found" error:**
- Make sure you deployed the Edge Function
- Check the function name matches: `create-checkout-session`

**"Stripe secret key not set" error:**
- Make sure you set the secret key: `supabase secrets set STRIPE_SECRET_KEY=...`

**Payment not working:**
- Check Stripe Dashboard → Payments for any errors
- Make sure you're using test mode keys for testing
- Check browser console for errors

## 💡 Test Cards

For testing (use test mode):
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

**Need help?** Check Stripe docs: https://stripe.com/docs

