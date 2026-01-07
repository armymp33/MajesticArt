import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { CartProvider } from '@/contexts/CartContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AppProvider>
  );
};

export default Index;
