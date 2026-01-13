'use client'

import { CartPageUIProps } from '../types/CartPageUIProps'
import CartItemUI from './CartItemUI'
import CartSummaryUI from './CartSummaryUI'

export default function CartPageUI({ items, total, loading, onRemoveItem }: CartPageUIProps) {
  if (loading) {
    return <div>Идёт загрузка корзины</div>
  }

  return (
    <section>
      <div>
        {items.map((item) => (
          <CartItemUI key={item.id} item={item} />
        ))}
      </div>
      <CartSummaryUI total={total} />
    </section>
  )
}