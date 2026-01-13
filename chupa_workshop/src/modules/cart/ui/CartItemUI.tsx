import { formatPrice } from '@/shared/lib/formatPrice'

import { CartItem as CartItemType } from '../types/CartItem'

type CartItemProps = {
  item: CartItemType
}

export default function CartItemUI({ item }: CartItemProps) {
  return (
    <div>
      <div>{item.title}</div>
      <div>Qty: {item.quantity}</div>
      <div>{formatPrice(item.price * item.quantity)}</div>
    </div>
  )
}
