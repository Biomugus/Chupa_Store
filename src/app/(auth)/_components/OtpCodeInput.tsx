// src/app/(auth)/confirm/OtpCodeInput.tsx

'use client';

import { useRef } from 'react';
import styles from '../auth.module.css';

type OtpCodeInputProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
};

/**
 * Segmented one-time-code input: one box per digit, auto-advances focus,
 * supports backspace-to-previous and pasting the whole code at once.
 * This is the standard pattern for OTP entry (Google, Apple ID, Stripe,
 * banking apps) — no placeholder text needed, empty boxes are self-evident.
 */
export function OtpCodeInput({ length, value, onChange, hasError, disabled }: OtpCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const setDigitAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(''));
  };

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handleChange = (index: number, rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '');
    if (!digitsOnly) {
      setDigitAt(index, '');
      return;
    }

    // Handle typing over a filled box, or a quick multi-char input from
    // some mobile keyboards: take the last typed character.
    setDigitAt(index, digitsOnly[digitsOnly.length - 1]);
    if (index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
      setDigitAt(index - 1, '');
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    e.preventDefault();

    onChange(pasted.slice(0, length));
    const nextFocusIndex = Math.min(pasted.length, length - 1);
    focusInput(nextFocusIndex);
  };

  return (
    <div className={styles.otpBoxRow} role="group" aria-label="Код подтверждения">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`${styles.otpBox} ${hasError ? styles.otpBoxError : ''}`}
          aria-label={`Цифра ${index + 1} из ${length}`}
        />
      ))}
    </div>
  );
}
