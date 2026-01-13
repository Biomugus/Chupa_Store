import { CartPageContainer } from '@/modules/cart/containers/CartPageContainer'
import { Suspense } from 'react'

export default function CartPage() {
  return (
    <Suspense fallback={<div>Идёт загрузка корзины....</div>}>
      <CartPageContainer />
    </Suspense>
  )
}
