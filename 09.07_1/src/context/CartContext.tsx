import { createContext, useState, ReactNode } from 'react';
import { IProductBrief } from '../dal/api';

export interface CartItem {
  product: IProductBrief;
  quantity: number;
}

export interface ICartContext {
  items: CartItem[];
  addToCart: (product: IProductBrief) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<ICartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: IProductBrief) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
        setItems(prev => prev.filter(i => i.product.id !== productId));
      }
    } else {
      setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  };

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}
