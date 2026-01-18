import { formatPrice } from '@/shared/lib/formatPrice'
import Image from 'next/image'

import { CartItem as CartItemType } from '../types/CartItem'
import styles from './cartItemUI.module.css'

type CartItemProps = {
  item: CartItemType
  onRemoveItem: (id: string) => void
}

export default function CartItemUi({ item, onRemoveItem }: CartItemProps) {
  return (
    <article className={styles.item}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.image}
          alt={item.title}
          width={100}
          height={100}
        />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.title}>{item.title}</span>
        </header>

        <div className={styles.footer}>
          <span className={styles.price}>
            {formatPrice(item.price * item.quantity)}
          </span>

          <button
            className={styles.removeButton}
            onClick={() => onRemoveItem(item.id)}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  )

}
