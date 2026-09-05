// src/modules/auth/validation/authSchemas.ts

import { z } from 'zod';

/**
 * Sanitizes string input by stripping HTML tags and trimming whitespace.
 * Prevents basic XSS injection through form inputs.
 */
const sanitize = (value: string): string => value.replace(/<[^>]*>/g, '').trim();

/**
 * Email validation: required, valid format, sanitized, max length.
 */
const emailField = z
  .string()
  .min(1, { message: 'Введите email' })
  .max(254, { message: 'Email слишком длинный' })
  .email({ message: 'Некорректный формат email' })
  .transform(sanitize)
  .transform((val) => val.toLowerCase());

/**
 * Password validation: min 8 chars, max 72 (bcrypt limit).
 */
const passwordField = z
  .string()
  .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
  .max(72, { message: 'Пароль слишком длинный (максимум 72 символа)' });

/**
 * Login form schema.
 */
export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

/**
 * Registration form schema with password confirmation.
 */
export const registerSchema = z
  .object({
    email: emailField,
    fullName: z
      .string()
      .min(1, { message: 'Введите имя' })
      .max(100, { message: 'Имя слишком длинное' })
      .transform(sanitize),
    password: passwordField,
    confirmPassword: z.string().min(1, { message: 'Подтвердите пароль' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

/**
 * Length of the signup confirmation code, as configured in Supabase
 * (Dashboard → Authentication → Sign In / Providers → Email → Email OTP
 * Length). Supabase's own default is 6, but this project's instance is
 * set to 8 — keep this in sync with that setting.
 */
export const SIGNUP_OTP_LENGTH = 8;

/**
 * Signup OTP confirmation schema: email + confirmation code from the email.
 */
export const otpSchema = z.object({
  email: emailField,
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${SIGNUP_OTP_LENGTH}}$`), {
      message: `Код должен содержать ${SIGNUP_OTP_LENGTH} цифр`,
    }),
});

/**
 * Resend signup OTP schema: just the email to resend the code to.
 */
export const resendOtpSchema = z.object({
  email: emailField,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
