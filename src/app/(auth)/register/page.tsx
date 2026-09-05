// src/app/(auth)/register/page.tsx

'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { register } from '../actions';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);
  const [email, setEmail] = useState('');

  return (
    <div className={styles.authCard}>
      <div className={styles.authBrand}>
        <h1 className={styles.authBrandTitle}>Мастерская Чупы</h1>
        <p className={styles.authBrandSubtitle}>Создать аккаунт</p>
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
          <label htmlFor="register-email" className={styles.fieldLabel}>
            Email
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={state?.fieldErrors?.email ? 'register-email-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.email ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.email && (
            <p id="register-email-error" className={styles.fieldError}>
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="register-fullname" className={styles.fieldLabel}>
            Имя
          </label>
          <input
            id="register-fullname"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            placeholder="Как к вам обращаться"
            aria-describedby={state?.fieldErrors?.fullName ? 'register-fullname-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.fullName ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.fullName && (
            <p id="register-fullname-error" className={styles.fieldError}>
              {state.fieldErrors.fullName[0]}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="register-password" className={styles.fieldLabel}>
            Пароль
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Минимум 8 символов"
            aria-describedby={state?.fieldErrors?.password ? 'register-password-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.password ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.password && (
            <p id="register-password-error" className={styles.fieldError}>
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="register-confirm" className={styles.fieldLabel}>
            Подтвердите пароль
          </label>
          <input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Повторите пароль"
            aria-describedby={
              state?.fieldErrors?.confirmPassword ? 'register-confirm-error' : undefined
            }
            className={`${styles.fieldInput} ${state?.fieldErrors?.confirmPassword ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.confirmPassword && (
            <p id="register-confirm-error" className={styles.fieldError}>
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? <span className={styles.spinner} /> : 'Создать аккаунт'}
        </button>
      </form>

      <div className={styles.authFooter}>
        <p className={styles.authFooterText}>
          Уже есть аккаунт?{' '}
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
