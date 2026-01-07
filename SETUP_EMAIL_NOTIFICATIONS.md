# Setup Email Notifications

## Current Status

✅ Newsletter subscription saves to database  
❌ Welcome emails are not being sent yet

## Quick Options to Send Emails

### Option 1: Resend (Recommended - Easiest)

**Pros:**
- Free tier: 3,000 emails/month
- Easy setup
- Great for transactional emails
- Simple API

**Setup:**
1. Sign up at https://resend.com
2. Get your API key
3. Add to Supabase secrets: `RESEND_API_KEY`
4. Uncomment the Resend code in `send-newsletter-welcome/index.ts`
5. Deploy the function

### Option 2: SendGrid

**Pros:**
- Free tier: 100 emails/day
- Reliable
- Good for marketing emails

**Setup:**
1. Sign up at https://sendgrid.com
2. Get API key
3. Similar setup to Resend

### Option 3: Supabase SMTP (Built-in)

**Pros:**
- Already integrated
- No extra service needed

**Setup:**
1. Go to Supabase Dashboard → Settings → Auth → SMTP Settings
2. Configure your email provider (Gmail, SendGrid, etc.)
3. Use Supabase's email functions

### Option 4: Mailgun

**Pros:**
- Free tier: 5,000 emails/month
- Good deliverability

## Recommended: Resend Setup

### Step 1: Sign Up
1. Go to https://resend.com
2. Create free account
3. Verify your domain (or use their test domain for now)

### Step 2: Get API Key
1. Go to API Keys section
2. Create new key
3. Copy the key (starts with `re_...`)

### Step 3: Add to Supabase
1. Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add: `RESEND_API_KEY` = your Resend API key
3. Save

### Step 4: Update Email Function
1. Open `supabase/functions/send-newsletter-welcome/index.ts`
2. Uncomment the Resend code (lines with `// Example with Resend:`)
3. Update the `from` email to your domain
4. Deploy the function

### Step 5: Test
1. Subscribe to newsletter
2. Check inbox for welcome email with discount code

## What the Email Will Include

- Welcome message
- 10% discount code: **WELCOME10**
- Branded design matching your site

## For Now (Temporary)

The subscription is working and saving emails. You can:
- Manually send discount codes
- Export emails from Supabase
- Set up automated emails later

**Want me to set up Resend for you?** It's the quickest option and I can have it working in minutes!

