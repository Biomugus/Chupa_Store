// src/app/(auth)/reset-password/page.tsx

'use client';

import { useActionState, useEffect, useRef } from 'react';
import { updatePassword } from '../actions';
import styles from '../auth.module.css';

/**
 * Password recovery, step 3: pick a new password. Only reachable with a
 * session (see PROTECTED_ROUTES in src/proxy.ts) — normally the one that
 * verifyRecoveryOtp just created.
 */
export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Both fields are cleared after a failed attempt — start over at the first one
  // unless only the confirmation was wrong
  useEffect(() => {
    if (!state?.error) return;
    const name =
      state.fieldErrors?.confirmPassword && !state.fieldErrors.password
        ? 'confirmPassword'
        : 'password';
    const field = formRef.current?.elements.namedItem(name);
    if (field instanceof HTMLInputElement) field.focus();
  }, [state]);

  return (
    <div className={styles.authCard}>
      <div className={styles.authBrand}>
        <h1 className={styles.authBrandTitle}>Мастерская Чупы</h1>
        <p className={styles.authBrandSubtitle}>Новый пароль</p>
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

      <form ref={formRef} action={formAction} className={styles.authForm} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="reset-password" className={styles.fieldLabel}>
            Новый пароль
          </label>
          <input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            autoFocus
            placeholder="Минимум 8 символов"
            aria-describedby={state?.fieldErrors?.password ? 'reset-password-error' : undefined}
            className={`${styles.fieldInput} ${state?.fieldErrors?.password ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.password && (
            <p id="reset-password-error" className={styles.fieldError}>
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="reset-confirm" className={styles.fieldLabel}>
            Подтвердите пароль
          </label>
          <input
            id="reset-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Повторите пароль"
            aria-describedby={
              state?.fieldErrors?.confirmPassword ? 'reset-confirm-error' : undefined
            }
            className={`${styles.fieldInput} ${state?.fieldErrors?.confirmPassword ? styles.fieldInputError : ''}`}
          />
          {state?.fieldErrors?.confirmPassword && (
            <p id="reset-confirm-error" className={styles.fieldError}>
              {state.fieldErrors.confirmPassword[0]}
            </p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? <span className={styles.spinner} /> : 'Сохранить пароль'}
        </button>
      </form>
    </div>
  );
}
