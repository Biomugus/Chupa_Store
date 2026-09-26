'use client';

// src/modules/cart/ui/CartPageUI.tsx

import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import Link from 'next/link';
import { CartPageUIProps } from '../types/CartPageUIProps';
import CartItemUI from './CartItemUI';
import CartSummaryUI from './CartSummaryUI';
import { OrderJourneyTimeline } from './OrderJourneyTimeline';
import styles from './cartPageUI.module.css';

export function CartPageUI({
  items,
  total,
  mounted,
  onCheckout,
  onChangeQuantity,
}: CartPageUIProps) {
  const isEmpty = items.length === 0;

  // До монтирования корзина из localStorage ещё не прочитана — показываем
  // скелетон с той же разметкой, что и у пустой корзины, чтобы не было скачка.
  if (!mounted) {
    return (
      <section className={styles.page} aria-busy="true">
        <span className="sr-only">Загрузка корзины</span>
        <EmptyCart skeleton />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      {isEmpty && <EmptyCart />}

      {!isEmpty && (
        <>
          <div className={styles.cartLayout}>
            {/* Items list */}
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItemUI key={item.id} item={item} onChangeQuantity={onChangeQuantity} />
              ))}
            </div>

            {/* Summary sidebar */}
            <aside className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <CartSummaryUI total={total} />

                <div className={styles.summaryMeta}>
                  <span className={styles.summaryLabel}>Товаров в корзине</span>
                  <span className={styles.summaryValue}>
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                {onCheckout && total > 0 && (
                  <button
                    className={`${btnStyles.btnGradientPrimary} ${styles.checkoutButton}`}
                    onClick={onCheckout}
                  >
                    Оформить заказ
                  </button>
                )}

                <Link href="/catalog" className={styles.continueLink}>
                  ← Продолжить покупки
                </Link>
              </div>
            </aside>
          </div>

          <OrderJourneyTimeline />
        </>
      )}
    </section>
  );
}

function EmptyCart({ skeleton = false }: { skeleton?: boolean }) {
  const text = skeleton ? styles.skeletonText : undefined;

  return (
    <div className={styles.emptyState} aria-hidden={skeleton || undefined}>
      {skeleton ? (
        <div className={styles.skeletonIcon} />
      ) : (
        <div className={styles.emptyIcon}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
      )}

      <div className={styles.emptyContent}>
        <h2 className={styles.emptyTitle}>
          <span className={text}>Корзина пуста</span>
        </h2>
        <p className={styles.emptyDescription}>
          <span className={text}>
            Вернитесь в каталог и добавьте изделия, чтобы оформить заказ.
          </span>
        </p>
      </div>

      {skeleton ? (
        <span
          className={`${btnStyles.btnGradientPrimary} ${styles.emptyButton} ${styles.skeletonButton}`}
        >
          Перейти в каталог
        </span>
      ) : (
        <Link href="/catalog" className={`${btnStyles.btnGradientPrimary} ${styles.emptyButton}`}>
          Перейти в каталог
        </Link>
      )}
    </div>
  );
}
