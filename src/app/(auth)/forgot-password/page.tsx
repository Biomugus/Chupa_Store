// src/app/(auth)/forgot-password/page.tsx

import Link from 'next/link';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import styles from '../auth.module.css';

export const metadata = {
  title: 'Восстановление пароля — Мастерская Чупы',
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

/**
 * Password recovery, steps 1–2: email → code from the email. A valid code
 * signs the user in and sends them to /reset-password to pick a new one.
 */
export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const { email } = await searchParams;

  return (
    <div className={styles.authCard}>
      <div className={styles.authBrand}>
        <h1 className={styles.authBrandTitle}>Мастерская Чупы</h1>
        <p className={styles.authBrandSubtitle}>Восстановление пароля</p>
      </div>

      <ForgotPasswordForm initialEmail={email} />

      <div className={styles.authFooter}>
        <p className={styles.authFooterText}>
          Вспомнили пароль?{' '}
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
