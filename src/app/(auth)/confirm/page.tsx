// src/app/(auth)/confirm/page.tsx

import Link from 'next/link';
import { ConfirmEmailForm } from './ConfirmEmailForm';
import styles from '../auth.module.css';

export const metadata = {
  title: 'Подтвердите email — Мастерская Чупы',
};

type ConfirmPageProps = {
  searchParams: Promise<{ email?: string }>;
};

/**
 * Standalone email-confirmation step, reachable on its own (not only right
 * after signing up) — e.g. when a user with an unconfirmed account closes
 * the tab and comes back later, tries to log in, and gets redirected here
 * (see `login` in ../actions.ts).
 */
export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { email } = await searchParams;

  return (
    <div className={styles.authCard}>
      <div className={styles.authBrand}>
        <h1 className={styles.authBrandTitle}>Мастерская Чупы</h1>
        <p className={styles.authBrandSubtitle}>Подтвердите email</p>
      </div>

      <ConfirmEmailForm initialEmail={email} />

      <div className={styles.authFooter}>
        <p className={styles.authFooterText}>
          Уже подтвердили email?{' '}
          <Link href="/login" className={styles.authFooterLink}>
            Войти
          </Link>
        </p>
      </div>

      <Link href="/" className={styles.backLink}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>
    </div>
  );
}
