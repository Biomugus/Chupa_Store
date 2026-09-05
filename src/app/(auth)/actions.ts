'use server';

// src/app/(auth)/actions.ts

import { AuthActionResult } from '@/modules/auth/types/authTypes';
import {
  loginSchema,
  otpSchema,
  registerSchema,
  resendOtpSchema,
} from '@/modules/auth/validation/authSchemas';
import { createClient } from '@/shared/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Maps Supabase Auth error messages to user-friendly Russian strings.
 * Keeps security in mind: no specific "user not found" messages.
 */
function getAuthErrorMessage(error: string): string {
  const message = error.toLowerCase();

  const errorMap: Record<string, string> = {
    'invalid login credentials':
      'Неверный email или пароль. Проверьте данные или зарегистрируйтесь, если у вас ещё нет аккаунта',
    'email not confirmed': 'Email не подтверждён. Проверьте почту',
    'user already registered': 'Пользователь с таким email уже зарегистрирован',
    'signup requires a valid password': 'Введите корректный пароль',
    'password should be at least 6 characters': 'Пароль должен содержать минимум 8 символов',
    'email rate limit exceeded': 'Слишком много попыток. Попробуйте позже',
    'for security purposes, you can only request this after 60 seconds':
      'Подождите 60 секунд перед повторной попыткой',
    'token has expired or is invalid': 'Код неверен или истёк. Запросите новый.',
    'invalid otp': 'Код неверен. Проверьте и попробуйте снова.',
  };

  if (errorMap[message]) return errorMap[message];

  // Supabase returns a dynamic wait time ("...after N seconds") that won't
  // match the map above verbatim — catch it separately.
  if (message.includes('you can only request this after')) {
    return 'Подождите немного перед повторной отправкой кода';
  }

  return 'Произошла ошибка. Попробуйте позже';
}

/**
 * Login Server Action.
 * Validates input → authenticates via Supabase → redirects to /account.
 */
export async function login(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // 1. Validate & sanitize
  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: 'Проверьте введённые данные',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Authenticate
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    // The account exists but never finished email confirmation (e.g. the
    // user closed the tab mid-signup and came back later) — send them to
    // finish that instead of a dead-end error message they can't act on.
    if (error.code === 'email_not_confirmed') {
      redirect(`/confirm?email=${encodeURIComponent(result.data.email)}`);
    }

    return { error: getAuthErrorMessage(error.message) };
  }

  // 3. Success → redirect
  revalidatePath('/', 'layout');
  redirect('/account');
}

/**
 * Register Server Action.
 * Validates input → creates user via Supabase → shows confirmation message.
 */
export async function register(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    fullName: formData.get('fullName'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  // 1. Validate & sanitize
  const result = registerSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: 'Проверьте введённые данные',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Create user
  // Note: no `emailRedirectTo` — confirmation is done via a 6-digit code
  // (see verifySignupOtp below), not a magic link. The "Confirm signup"
  // email template in Supabase Dashboard must show {{ .Token }}.
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  });

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  // 3. Supabase sends a confirmation email with a code automatically —
  // send the user straight to the code-entry step.
  redirect(`/confirm?email=${encodeURIComponent(result.data.email)}`);
}

/**
 * Verify Signup OTP Server Action.
 * Confirms the 6-digit code sent by email → creates a session → redirects to /account.
 */
export async function verifySignupOtp(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    code: formData.get('code'),
  };

  // 1. Validate & sanitize
  const result = otpSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: 'Проверьте введённые данные',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 2. Verify the code
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: result.data.email,
    token: result.data.code,
    type: 'signup',
  });

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  // 3. Success → session is set, redirect straight into the account
  revalidatePath('/', 'layout');
  redirect('/account');
}

/**
 * Resend Signup OTP Server Action.
 * Asks Supabase to send a fresh confirmation code to the given email.
 */
export async function resendSignupOtp(
  _prevState: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const rawData = { email: formData.get('email') };

  const result = resendOtpSchema.safeParse(rawData);
  if (!result.success) {
    return { error: 'Некорректный email' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: result.data.email,
  });

  if (error) {
    return { error: getAuthErrorMessage(error.message) };
  }

  return { success: 'Код отправлен повторно. Проверьте почту.' };
}

/**
 * Logout Server Action.
 * Signs out the user and redirects to login page.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
