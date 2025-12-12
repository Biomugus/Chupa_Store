import { useEffect, useState } from 'react';

import { addToCart, fetchCart, removeFromCart } from '../api/cartApi';
import { CartItem } from '../types/CartItem';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCart()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addItem = async (item: CartItem) => {
    const data = await addToCart(item);
    setItems(data);
  };

  const removeItem = async (id: string) => {
    const data = await removeFromCart(id);
    setItems(data);
  };

  return { items, total, loading, addItem, removeItem };
}

