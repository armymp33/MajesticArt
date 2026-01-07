import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CheckoutCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-[#2C2C2C] mb-4">Checkout Cancelled</h1>
        <p className="text-[#2C2C2C]/60 mb-6">
          Forgot to add something to your cart? Shop around then come back to pay!
        </p>
        <p className="text-sm text-[#2C2C2C]/50 mb-6">
          No charges were made. Your items are still in your cart if you'd like to try again.
        </p>
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
      </div>
    </div>
  );
};

export default CheckoutCancel;

