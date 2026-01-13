// cart/hooks/useCart.ts
import { cartStore } from '../store/CartStore';

export const useCart = () => {
  return {
    items: cartStore.model.items,
    total: cartStore.total,
    loading: cartStore.loading,
    addItem: cartStore.addItem.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    clear: cartStore.clear.bind(cartStore),
  };
};
