import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  artworkId: string;
  title: string;
  image: string;
  productType: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    const existingItem = items.find(
      i => i.artworkId === item.artworkId && i.productType === item.productType && i.size === item.size
    );

    if (existingItem) {
      setItems(items.map(i => 
        i.id === existingItem.id 
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      const newItem: CartItem = {
        ...item,
        id: `${item.artworkId}-${item.productType}-${item.size}-${Date.now()}`,
        quantity: 1
      };
      setItems([...items, newItem]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setItems(items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
