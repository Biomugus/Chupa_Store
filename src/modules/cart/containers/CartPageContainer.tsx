'use client';

import { useCart } from '../hooks/useCart';
import { CartPageUI } from '../ui/CartPageUI';

export const CartPageContainer = () => {
  const { items, total, loading, changeQuantity } = useCart();

  return (
    <CartPageUI items={items} total={total} loading={loading} onChangeQuantity={changeQuantity} />
  );
};
