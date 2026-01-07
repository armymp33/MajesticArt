# Fix Stripe Checkout Branding - Show "Majestic Art" Instead of "AudioVerse"

## The Problem

Your Stripe checkout page is showing "AudioVerse" instead of "Majestic Art" because your Stripe account settings have the wrong business name.

## How to Fix It

### Step 1: Update Business Information

1. Go to Stripe Dashboard: https://dashboard.stripe.com
2. Click **Settings** (gear icon) → **Business settings**
3. Update:
   - **Business name**: Change from "AudioVerse" to "Majestic Art" (or "Majestic Art Studio")
   - **Business type**: Set appropriately
   - **Website**: Your website URL
   - **Support email**: orders@majesticart.com (or your email)
4. Click **Save**

### Step 2: Update Checkout Branding

1. In Stripe Dashboard, go to **Settings** → **Branding**
2. Upload your logo (optional but recommended)
3. Set your brand colors to match your site:
   - Primary color: `#D4AF37` (your gold)
   - Accent color: `#9B86BD` (your purple)
4. Click **Save**

### Step 3: Update Payment Page Settings

1. Go to **Settings** → **Payment methods**
2. Make sure your business name appears correctly
3. Review **Checkout settings** to ensure correct branding

### Step 4: Test Again

1. Make a test purchase
2. The checkout page should now show "Majestic Art" instead of "AudioVerse"

## About the CO₂ Message

The "AudioVerse will contribute 1.5%..." message is from Stripe's Climate feature. You can:

**Option 1: Disable it**
- Go to **Settings** → **Climate**
- Turn off carbon removal contributions

**Option 2: Keep it but update the name**
- The name will automatically update when you change your business name
- Or customize the message in Climate settings

## Quick Fix Summary

1. Stripe Dashboard → Settings → Business settings
2. Change business name to "Majestic Art"
3. Save
4. Test checkout again

That's it! Your checkout will now show the correct business name.

