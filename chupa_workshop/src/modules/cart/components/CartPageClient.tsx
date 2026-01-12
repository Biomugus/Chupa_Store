'use client';

import { useCart } from '../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartPageClient() {
  const { items, total, loading } = useCart();

  if (loading) {
    return <div>Идёт загрузка корзины</div>;
  }

  return (
    <section>
      <div>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <CartSummary total={total} />
    </section>
  );
}
