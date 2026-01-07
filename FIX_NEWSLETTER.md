# Fix Newsletter Subscription Error

## The Problem

The error "Something went wrong. Please try again." happens because the `newsletter_subscribers` table doesn't exist in your Supabase database yet.

## Quick Fix

### Step 1: Create the Newsletter Table

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy and paste the SQL from `CREATE_NEWSLETTER_TABLE.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 2: Test It

1. Go back to your website
2. Try subscribing to the newsletter again
3. It should work now! ✅

## What This Creates

- `newsletter_subscribers` table to store email addresses
- Unique constraint on email (prevents duplicates)
- Tracks subscription date
- Allows unsubscribe tracking
- Public insert policy (anyone can sign up)

## After Creating the Table

The newsletter subscription will work for:
- Newsletter modal (popup)
- Footer newsletter signup
- Any other newsletter forms

That's it! Just run the SQL and the newsletter will work.

