import { formatPrice } from '@/shared/lib/formatPrice';
import Image from 'next/image';

import { CartItem as CartItemType } from '../types/CartItem';
import styles from './cartItemUI.module.css';

type QuantityDelta = -1 | 1;

type CartItemProps = {
  item: CartItemType;
  onChangeQuantity: (id: string, delta: QuantityDelta) => void;
};

export default function CartItemUi({ item, onChangeQuantity }: CartItemProps) {
  return (    
    <article className={styles.item}>
      <div className={styles.imageWrapper}>
        <Image src={item.image} alt={item.title} width={100} height={100} />
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.title}>{item.title}</span>
        </header>

        <div className={styles.footer}>
          <span className={styles.quantity}>x{item.quantity}</span>
          <span className={styles.price}>{formatPrice(item.price * item.quantity)}</span>

          <div className={styles.buttonsWrapper}>
            <button
              className={styles.removeButton}
              onClick={() => onChangeQuantity(item.id, -1)}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <button
              className={styles.addButton}
              onClick={() => onChangeQuantity(item.id, +1)}
              aria-label="Добавить количество"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
