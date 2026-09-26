// src/app/(auth)/forgot-password/ForgotPasswordForm.tsx

'use client';

import { useActionState, useEffect, useState } from 'react';
import { requestPasswordReset, verifyRecoveryOtp } from '../actions';
import styles from '../auth.module.css';
import { EMAIL_OTP_LENGTH } from '@/modules/auth/validation/authSchemas';
import { OtpCodeInput } from '../_components/OtpCodeInput';

type ForgotPasswordFormProps = {
  /** Pre-filled when coming from a failed login attempt. Unlike /confirm,
   * nothing has been sent yet, so we still start at the email step. */
  initialEmail?: string;
};

export function ForgotPasswordForm({ initialEmail = '' }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');

  const [sendState, sendAction, isSendPending] = useActionState(requestPasswordReset, null);
  const [resendState, resendAction, isResendPending] = useActionState(requestPasswordReset, null);
  const [otpState, otpAction, isOtpPending] = useActionState(verifyRecoveryOtp, null);

  useEffect(() => {
    if (sendState?.success) setCodeSent(true);
  }, [sendState]);

  // Clear the code after a failed attempt so the user retypes it fresh
  useEffect(() => {
    if (otpState?.error) setCode('');
  }, [otpState]);

  if (!codeSent) {
    return (
      <form action={sendAction} className={styles.authForm} noValidate>
        <p className={styles.authFooterText} style={{ textAlign: 'center' }}>
          Укажите email, привязанный к аккаунту — мы пришлём на него код для сброса пароля
        </p>

        <div className={styles.fieldGroup}>
          <label htmlFor="forgot-email" className={styles.fieldLabel}>
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={sendState?.error ? 'forgot-email-error' : undefined}
            className={`${styles.fieldInput} ${sendState?.error ? styles.fieldInputError : ''}`}
          />
          {sendState?.error && (
            <p id="forgot-email-error" className={styles.fieldError}>
              {sendState.error}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSendPending} className={styles.submitButton}>
          {isSendPending ? <span className={styles.spinner} /> : 'Получить код'}
        </button>
      </form>
    );
  }

  return (
    <>
      {/* Deliberately doesn't confirm the account exists — see requestPasswordReset */}
      <p className={styles.authFooterText} style={{ marginBottom: 20, textAlign: 'center' }}>
        Если аккаунт с адресом <strong>{email}</strong> существует, мы отправили на него код
      </p>

      <form action={otpAction} className={styles.authForm} noValidate>
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="code" value={code} readOnly />

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} style={{ textAlign: 'center' }}>
            Код из письма
          </label>
          <OtpCodeInput
            length={EMAIL_OTP_LENGTH}
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
          disabled={isOtpPending || code.length !== EMAIL_OTP_LENGTH}
          className={styles.submitButton}
        >
          {isOtpPending ? <span className={styles.spinner} /> : 'Продолжить'}
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
        <button
          type="button"
          onClick={() => {
            setCodeSent(false);
            setCode('');
          }}
          className={styles.linkButton}
          style={{ marginTop: 12 }}
        >
          Изменить email
        </button>
      </div>
    </>
  );
}
