import { supabase } from '@/lib/supabase';

/**
 * Fulfill an order from a checkout session
 * This is called from the success page to ensure immediate fulfillment
 * Webhooks also trigger fulfillment for reliability
 */
export const fulfillOrder = async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Call your fulfillment endpoint
    // You can create a separate Edge Function for this, or use the webhook function
    const { data, error } = await supabase.functions.invoke('stripe-webhook', {
      body: { sessionId, source: 'landing_page' },
    });

    if (error) {
      console.error('Fulfillment error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Fulfillment error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Alternative: Direct fulfillment from success page
 * This can call your database or other services directly
 */
export const fulfillOrderDirect = async (sessionId: string) => {
  try {
    // TODO: Implement your fulfillment logic here
    // Examples:
    // - Save order to database
    // - Send confirmation email
    // - Update inventory
    // - Trigger shipping
    
    // Example: Save to orders table (create this table first)
    /*
    const { error } = await supabase.from('orders').insert({
      session_id: sessionId,
      fulfilled: true,
      fulfilled_at: new Date().toISOString(),
    });
    
    if (error) throw error;
    */

    return { success: true };
  } catch (error: any) {
    console.error('Direct fulfillment error:', error);
    return { success: false, error: error.message };
  }
};

