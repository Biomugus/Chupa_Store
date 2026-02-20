// src/app/(auth)/layout.tsx

import type { ReactNode } from 'react';
import styles from './auth.module.css';

export const metadata = {
  title: 'Авторизация — Мастерская Чупы',
  description: 'Вход и регистрация в Мастерской Чупы',
};

/**
 * Auth layout: standalone, no Header/Footer.
 * Full-screen dark background with centered auth card.
 * Root layout provides html/body, this just adds the visual wrapper.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBackground} />
      <main className={styles.authMain}>{children}</main>
    </div>
  );
}
