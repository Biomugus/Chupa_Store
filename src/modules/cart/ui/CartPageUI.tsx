'use client';

// src/modules/cart/ui/CartPageUI.tsx

import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import Link from 'next/link';
import { CartPageUIProps } from '../types/CartPageUIProps';
import CartItemUI from './CartItemUI';
import CartSummaryUI from './CartSummaryUI';
import styles from './cartPageUI.module.css';

export function CartPageUI({
  items,
  total,
  loading,
  onCheckout,
  onChangeQuantity,
}: CartPageUIProps) {
  const isEmpty = items.length === 0;

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Загрузка корзины...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>Корзина</h1>

      {isEmpty && (
        <div className={styles.emptyState}>
          {/* Decorative weapon crosshair icon */}
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>

          <div className={styles.emptyContent}>
            <h2 className={styles.emptyTitle}>Корзина пуста</h2>
            <p className={styles.emptyDescription}>
              Добавьте изделия из каталога, чтобы оформить заказ.
              <br />
              Каждое изделие мастерской — ручная работа, выполненная с вниманием к деталям.
            </p>
          </div>

          <Link href="/catalog" className={`${btnStyles.btnGradientPrimary} ${styles.emptyButton}`}>
            Перейти в каталог
          </Link>
        </div>
      )}

      {!isEmpty && (
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
      )}
    </section>
  );
}
