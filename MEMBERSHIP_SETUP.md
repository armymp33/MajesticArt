# Majesties Membership Setup Guide

## ✅ What's Been Created

1. ✅ Membership page component (`MembershipPage.tsx`)
2. ✅ Subscription checkout Edge Function (`create-subscription-session`)
3. ✅ Navigation link added ("Majesties")
4. ✅ Subscription integration ready

## 🔧 Setup Steps

### Step 1: Get Your Stripe Price ID

1. Go to Stripe Dashboard → **Products**
2. Find your "Majesties" membership product
3. Click on it to view details
4. Copy the **Price ID** (starts with `price_...`)
   - This is different from the Product ID
   - You need the Price ID for subscriptions

### Step 2: Update the Price ID in Code

1. Open `src/components/pages/MembershipPage.tsx`
2. Find this line:
   ```typescript
   const MEMBERSHIP_PRICE_ID = 'price_YOUR_PRICE_ID_HERE';
   ```
3. Replace `price_YOUR_PRICE_ID_HERE` with your actual Price ID from Stripe
4. Save the file

### Step 3: Deploy the Subscription Function

1. Go to Supabase Dashboard → **Edge Functions**
2. Click **Create a new function**
3. Name: `create-subscription-session`
4. Copy ALL code from: `supabase/functions/create-subscription-session/index.ts`
5. Paste and click **Deploy**

### Step 4: Test It!

1. Go to your website
2. Click "Majesties" in the navigation
3. Enter your email
4. Click "Start Membership"
5. You should be redirected to Stripe's subscription checkout
6. Use test card: `4242 4242 4242 4242`

## 🎯 How It Works

1. Customer visits Membership page
2. Enters email and clicks "Start Membership"
3. Your site calls the `create-subscription-session` Edge Function
4. Function creates a Stripe subscription checkout session
5. Customer redirected to Stripe's payment page
6. Customer pays and subscribes
7. Redirected back to success page
8. Subscription is active!

## 📝 Important Notes

- **Price ID vs Product ID**: Make sure you use the **Price ID** (`price_...`), not the Product ID
- **Subscription Mode**: The checkout uses `mode: 'subscription'` for recurring payments
- **Cancel URL**: If customer cancels, they're redirected back to the membership page
- **Webhooks**: Set up webhooks to handle subscription events (renewals, cancellations, etc.)

## 🔄 Next Steps (Optional)

### Handle Subscription Events

You can extend the webhook handler to manage:
- Subscription renewals
- Cancellations
- Payment failures
- Upgrades/downgrades

### Member Portal

Create a page where members can:
- View their subscription status
- Access exclusive content
- Manage their subscription
- Cancel if needed

## ✅ Done!

Your membership subscription is now integrated! Customers can join Majesties and get exclusive early access to artwork.

