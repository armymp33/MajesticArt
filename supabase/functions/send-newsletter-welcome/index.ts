// @ts-ignore - Deno types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Send welcome email using Resend
async function sendWelcomeEmail(email: string) {
  try {
    // @ts-ignore - Deno global
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set');
      return { success: false, error: 'Email service not configured' };
    }

    // Generate discount code
    const discountCode = 'WELCOME10';

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Majestic Art <onboarding@resend.dev>', // Change this to your verified domain
        to: email,
        subject: 'Welcome to Majestic Art Studio! 🎨',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2C2C2C; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2C2C2C; font-size: 32px; margin-bottom: 10px;">Welcome to the Studio!</h1>
              <p style="color: #2C2C2C; font-size: 18px;">Thank you for joining Majestic Art</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #9B86BD 0%, #D4AF37 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <h2 style="color: white; font-size: 24px; margin: 0 0 10px 0;">Your Exclusive Discount Code</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 36px; font-weight: bold; color: #D4AF37; margin: 0; letter-spacing: 3px;">${discountCode}</p>
              </div>
              <p style="color: white; margin: 0;">Use this code at checkout to save 10% on your first order!</p>
            </div>
            
            <div style="margin: 30px 0;">
              <p style="color: #2C2C2C; font-size: 16px;">We're so excited to have you as part of the Majestic Art community! As a subscriber, you'll receive:</p>
              <ul style="color: #2C2C2C; font-size: 16px; padding-left: 20px;">
                <li>Exclusive access to new releases</li>
                <li>Behind-the-scenes content</li>
                <li>Special offers and discounts</li>
                <li>First access to new artwork</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://yourdomain.com/?page=shop" style="background-color: #D4AF37; color: #2C2C2C; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Start Shopping</a>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px; text-align: center; color: #666; font-size: 14px;">
              <p>Questions? Email us at <a href="mailto:orders@majesticart.com" style="color: #9B86BD;">orders@majesticart.com</a></p>
              <p style="margin-top: 10px;">You can unsubscribe anytime by clicking the link in any email.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    
    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await sendWelcomeEmail(email)
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

