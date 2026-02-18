'use client';

import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import styles from './cartSuccessView.module.css';

export function CartSuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <svg
          className={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d9b56f"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 className={styles.title}>Заказ оформлен</h3>
      <p className={styles.message}>Мы свяжемся с вами в ближайшее время, спасибо за доверие!</p>
      <button className={`${btnStyles.btnBrand} ${styles.button}`} onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
}
