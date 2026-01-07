# Resend Email Setup - Quick Guide

## Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click **Sign Up** (free account)
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, go to **API Keys** in the sidebar
2. Click **Create API Key**
3. Give it a name (e.g., "Majestic Art Newsletter")
4. Copy the API key (starts with `re_...`)
   - ⚠️ **Important**: Copy it now - you won't see it again!

## Step 3: Add API Key to Supabase

1. Go to Supabase Dashboard → **Settings** → **Edge Functions** → **Secrets**
2. Click **Add secret**
3. Name: `RESEND_API_KEY`
4. Value: Paste your Resend API key (`re_...`)
5. Click **Save**

## Step 4: Deploy the Email Function

1. Go to Supabase Dashboard → **Edge Functions**
2. Click **Create a new function**
3. Name: `send-newsletter-welcome`
4. Copy ALL code from: `supabase/functions/send-newsletter-welcome/index.ts`
5. Paste and click **Deploy**

## Step 5: Test It!

1. Go to your website
2. Subscribe to the newsletter with a test email
3. Check your inbox - you should receive the welcome email! 🎉

## Step 6: Verify Your Domain (Optional but Recommended)

For production, you'll want to use your own domain instead of `onboarding@resend.dev`:

1. In Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `majesticart.com`)
4. Follow the DNS setup instructions
5. Once verified, update the `from` email in the function:
   - Change: `'Majestic Art <onboarding@resend.dev>'`
   - To: `'Majestic Art <hello@majesticart.com>'` (or your domain)

## What the Email Includes

✅ Beautiful branded design  
✅ Welcome message  
✅ 10% discount code: **WELCOME10**  
✅ Benefits list  
✅ Shop button  
✅ Contact information  

## Free Tier Limits

- **3,000 emails/month** (free)
- Perfect for getting started!
- Upgrade later if needed

## Troubleshooting

**Email not sending?**
- Check Supabase logs for errors
- Verify API key is set correctly
- Make sure function is deployed

**Using test domain?**
- Emails from `onboarding@resend.dev` may go to spam
- Verify your domain for better deliverability

## ✅ Done!

Once you complete these steps, welcome emails will automatically send when someone subscribes to your newsletter!

