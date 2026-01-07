import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { fulfillOrderDirect } from '@/services/fulfillmentService';

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [fulfilled, setFulfilled] = useState(false);

  useEffect(() => {
    // Trigger fulfillment when page loads
    const handleFulfillment = async () => {
      if (sessionId) {
        try {
          // Trigger fulfillment from landing page (webhooks also handle this)
          const result = await fulfillOrderDirect(sessionId);
          if (result.success) {
            setFulfilled(true);
          }
        } catch (error) {
          console.error('Fulfillment error:', error);
          // Don't show error to user - webhooks will handle it
        }
      }
      setLoading(false);
    };

    handleFulfillment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <div className="py-12">Verifying payment...</div>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Payment Successful!</h1>
            <p className="text-[#2C2C2C]/60 mb-4">
              Thank you for your purchase! Your order has been confirmed and you will receive an email confirmation shortly.
            </p>
            <p className="text-[#2C2C2C]/60 mb-6">
              We appreciate your business! If you have any questions, please email{' '}
              <a 
                href="mailto:orders@majesticart.com" 
                className="text-[#9B86BD] hover:text-[#D4AF37] transition-colors underline"
              >
                orders@majesticart.com
              </a>
              .
            </p>
            {sessionId && (
              <p className="text-xs text-[#2C2C2C]/40 mb-6">
                Order ID: {sessionId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/')}
                className="bg-[#D4AF37] hover:bg-[#E5C048] text-[#2C2C2C]"
              >
                Return Home
              </Button>
              <Button
                onClick={() => navigate('/?page=shop')}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;

