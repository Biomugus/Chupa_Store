import CartPageClient from '@/modules/cart/components/CartPageClient';
import { Suspense } from 'react';

export default function CartPage() {
  return (
    <Suspense fallback={<div>Идёт загрузка корзины....</div>}>
      <CartPageClient />
    </Suspense>
  );
}
