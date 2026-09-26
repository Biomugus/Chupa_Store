// src/app/(auth)/login/page.tsx

'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef } from 'react';
import { login } from '../actions';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // After a failed attempt the email is restored but the password is cleared,
  // so put the cursor where the user has to act next
  useEffect(() => {
    if (!state?.error) return;
    (state.fieldErrors?.email ? emailRef : passwordRef).current?.focus();
  }, [state]);

  return (
    <div className={styles.authCard}>
      <div className={styles.authBrand}>
        <h1 className={styles.authBrandTitle}>Мастерская Чупы</h1>
        <p className={styles.authBrandSubtitle}>Вход в личный кабинет</p>
      </div>

      {state?.error && !state.fieldErrors && (
        <div className={styles.alertError}>
          <svg
            className={styles.alertIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className={styles.authForm} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="login-email" className={styles.fieldLabel}>
            Email
          </label>
          <input
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            defaultValue={state?.values?.email}
            placeholder="your@email.com"
            aria-describedby={state?.fieldErrors?.email ? 'login-email-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.email ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.email && (
            <p id="login-email-error" className={styles.fieldError}>
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="login-password" className={styles.fieldLabel}>
            Пароль
          </label>
          <input
            ref={passwordRef}
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Минимум 8 символов"
            aria-describedby={state?.fieldErrors?.password ? 'login-password-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.password ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.password && (
            <p id="login-password-error" className={styles.fieldError}>
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? <span className={styles.spinner} /> : 'Войти'}
        </button>
      </form>

      <div className={styles.authFooter}>
        <p className={styles.authFooterText}>
          Нет аккаунта?{' '}
          <Link href="/register" className={styles.authFooterLink}>
            Зарегистрироваться
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
