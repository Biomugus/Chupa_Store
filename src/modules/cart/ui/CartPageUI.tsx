'use client';

import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import { CartPageUIProps } from '../types/CartPageUIProps';
import CartItemUI from './CartItemUI';
import CartSummaryUI from './CartSummaryUI';
import styles from './cartPageUI.module.css';

import { CartIcon } from '@/shared/icons/Carticon';

export function CartPageUI({
  items,
  total,
  loading,
  onCheckout,
  footerSlot,
  onChangeQuantity,
}: CartPageUIProps) {
  const isEmpty = items.length === 0;

  if (loading) {
    return <div>Идёт загрузка корзины</div>;
  }

  return (
    <section className={styles.pageUIContent}>
      {isEmpty && (
        <div className={styles.emptyState}>
          <CartIcon ready={true} className={styles.emptyIcon} />
          <p>Ваша корзина пуста - добавьте товары, чтобы оформить заказ.</p>
        </div>
      )}

      {!isEmpty && (
        <>
          <div>
            {items.map((item) => (
              <CartItemUI key={item.id} item={item} onChangeQuantity={onChangeQuantity} />
            ))}
          </div>

          {total > 0 && <CartSummaryUI total={total} />}

          {footerSlot}

          {onCheckout && total > 0 && (
            <button
              className={`${btnStyles.btnOutline} ${styles.checkoutButton}`}
              onClick={onCheckout}
            >
              Оформить заказ
            </button>
          )}
        </>
      )}
    </section>
  );
}
