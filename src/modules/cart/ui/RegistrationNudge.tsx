'use client';

// src/modules/cart/ui/RegistrationNudge.tsx

import Link from 'next/link';
import styles from './registrationNudge.module.css';

interface RegistrationNudgeProps {
  onContinueAsGuest: () => void;
}

export function RegistrationNudge({ onContinueAsGuest }: RegistrationNudgeProps) {
  return (
    <div className={styles.nudge}>
      <div className={styles.iconWrapper}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 12 15 16 10" />
        </svg>
      </div>

      <h3 className={styles.title}>Откройте доступ к Оружейке</h3>

      <p className={styles.description}>
        Зарегистрируйтесь — выберите Вашу платформу, и мы автоматически покажем совместимость
        товаров с Вашим карабином. Сэкономьте своё время на поиске нужных аксессуаров.
      </p>

      <div className={styles.actions}>
        <Link href="/register" className={styles.registerButton}>
          Зарегистрироваться
        </Link>
        <button type="button" className={styles.guestButton} onClick={onContinueAsGuest}>
          Продолжить без регистрации
        </button>
      </div>
    </div>
  );
}
