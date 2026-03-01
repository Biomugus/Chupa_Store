import { formatPrice } from '@/shared/lib/formatPrice';
import Image from 'next/image';

import { CartItem as CartItemType } from '../types/CartItem';
import { QuantityDelta } from '../types/CartPageUIProps';
import styles from './cartItemUI.module.css';

type CartItemProps = {
  item: CartItemType;
  onChangeQuantity: (id: string, delta: QuantityDelta) => void;
};

export default function CartItemUi({ item, onChangeQuantity }: CartItemProps) {
  return (
    <article className={styles.item}>
      <div className={styles.imageWrapper}>
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 80px, 100px"
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.price}>{formatPrice(item.price * item.quantity)}</span>
      </div>

      <div className={styles.actions}>
        {/* Stepper: [− qty +] */}
        <div className={styles.stepper}>
          <button
            className={styles.stepperBtn}
            onClick={() => onChangeQuantity(item.id, -1)}
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <span className={styles.stepperValue}>{item.quantity}</span>
          <button
            className={styles.stepperBtn}
            onClick={() => onChangeQuantity(item.id, +1)}
            aria-label="Добавить количество"
          >
            +
          </button>
        </div>

        {/* Удалить всю позицию */}
        <button
          className={styles.removeBtn}
          onClick={() => onChangeQuantity(item.id, -1)}
          aria-label="Удалить товар"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </article>
  );
}
