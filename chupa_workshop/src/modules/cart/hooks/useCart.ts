// cart/hooks/useCart.ts
import { cartStore } from '../store/CartStore';

export const useCart = () => {
  return {
    items: cartStore.items,
    total: cartStore.total,
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    clearCart: cartStore.clearCart.bind(cartStore),
    fetchCart: cartStore.fetchCartFromServer.bind(cartStore),
    loading: cartStore.loading,
  };
};
