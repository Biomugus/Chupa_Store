// src/app/(auth)/confirm/ConfirmEmailForm.tsx

'use client';

import { useActionState, useEffect, useState } from 'react';
import { resendSignupOtp, verifySignupOtp } from '../actions';
import styles from '../auth.module.css';
import { SIGNUP_OTP_LENGTH } from '@/modules/auth/validation/authSchemas';
import { OtpCodeInput } from './OtpCodeInput';

type ConfirmEmailFormProps = {
  /** Pre-filled when we arrive here from registration or a login attempt
   * with an unconfirmed account. Missing only if the user opened this
   * page directly (e.g. a bookmarked/typed URL). */
  initialEmail?: string;
};

export function ConfirmEmailForm({ initialEmail = '' }: ConfirmEmailFormProps) {
  const [email, setEmail] = useState(initialEmail);
  // Skip the "which email" step entirely when we already know it.
  const [emailKnown, setEmailKnown] = useState(!!initialEmail);
  const [code, setCode] = useState('');

  const [otpState, otpAction, isOtpPending] = useActionState(verifySignupOtp, null);
  const [resendState, resendAction, isResendPending] = useActionState(resendSignupOtp, null);

  // Move to the code-entry step once a code has actually been sent — either
  // because we arrived here already knowing the email (register/login
  // already triggered a send), or because the user just submitted the
  // "which email" step below and resendSignupOtp succeeded. Without this,
  // a direct/bookmarked visit to /confirm would show empty code boxes
  // without ever having asked Supabase to send anything.
  useEffect(() => {
    if (resendState?.success) setEmailKnown(true);
  }, [resendState]);

  // Clear the code after a failed attempt so the user retypes it fresh
  // instead of having to manually clear a wrong code from every box.
  useEffect(() => {
    if (otpState?.error) setCode('');
  }, [otpState]);

  if (!emailKnown) {
    return (
      <form action={resendAction} className={styles.authForm} noValidate>
        <div className={styles.fieldGroup}>
          <label htmlFor="confirm-email" className={styles.fieldLabel}>
            Email
          </label>
          <input
            id="confirm-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.fieldInput}
          />
          {resendState?.error && <p className={styles.fieldError}>{resendState.error}</p>}
        </div>

        <button type="submit" disabled={isResendPending} className={styles.submitButton}>
          {isResendPending ? <span className={styles.spinner} /> : 'Получить код'}
        </button>
      </form>
    );
  }

  return (
    <>
      <p className={styles.authFooterText} style={{ marginBottom: 20, textAlign: 'center' }}>
        Мы отправили код на <strong>{email}</strong>
      </p>

      <form action={otpAction} className={styles.authForm} noValidate>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="code" value={code} readOnly />

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} style={{ textAlign: 'center' }}>
            Код из письма
          </label>
          <OtpCodeInput
            length={SIGNUP_OTP_LENGTH}
            value={code}
            onChange={setCode}
            hasError={!!otpState?.error || !!otpState?.fieldErrors?.code}
            disabled={isOtpPending}
          />
          {(otpState?.error || otpState?.fieldErrors?.code) && (
            <p className={styles.fieldError} style={{ textAlign: 'center' }}>
              {otpState?.error ?? otpState?.fieldErrors?.code?.[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isOtpPending || code.length !== SIGNUP_OTP_LENGTH}
          className={styles.submitButton}
        >
          {isOtpPending ? <span className={styles.spinner} /> : 'Подтвердить'}
        </button>
      </form>

      <div className={styles.authFooter}>
        <form action={resendAction}>
          <input type="hidden" name="email" value={email} />
          <button type="submit" disabled={isResendPending} className={styles.linkButton}>
            {isResendPending ? 'Отправляем…' : 'Отправить код ещё раз'}
          </button>
        </form>
        {resendState?.success && (
          <p className={`${styles.inlineHint} ${styles.inlineHintSuccess}`}>
            {resendState.success}
          </p>
        )}
        {resendState?.error && (
          <p className={`${styles.inlineHint} ${styles.inlineHintError}`}>{resendState.error}</p>
        )}
      </div>
    </>
  );
}
