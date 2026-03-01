// cart/hooks/useCart.ts

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import {
  addItem,
  changeQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
} from '../store/cartSlice';
import { CartItem } from '../types/CartItem';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  return {
    items,
    total,
    addItem: (item: CartItem) => dispatch(addItem(item)),
    changeQuantity: (id: string, delta: 1 | -1) => dispatch(changeQuantity({ id, delta })),
    clear: () => dispatch(clearCart()),
  };
};
