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
import { type AuthError, isAuthRetryableFetchError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Maps Supabase Auth errors to user-friendly Russian strings.
 * Keeps security in mind: no specific "user not found" messages — Supabase
 * deliberately returns the same `invalid_credentials` for a wrong password
 * and a non-existent account, so we can't (and shouldn't) tell them apart.
 */
function getAuthErrorMessage(error: AuthError): string {
  // The request never got a proper answer from Supabase: no internet, DNS
  // failure, timeout (status 0) or the auth server is down (502/503/504).
  // These carry raw messages like "fetch failed" that no map below matches.
  if (isAuthRetryableFetchError(error)) {
    return error.status === 0
      ? 'Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте снова'
      : 'Сервис авторизации временно недоступен. Попробуйте через несколько минут';
  }

  const byCode: Record<string, string> = {
    invalid_credentials:
      'Неверный email или пароль. Проверьте данные или зарегистрируйтесь, если у вас ещё нет аккаунта',
    email_not_confirmed: 'Email не подтверждён. Проверьте почту',
    user_already_exists: 'Пользователь с таким email уже зарегистрирован',
    email_exists: 'Пользователь с таким email уже зарегистрирован',
    weak_password: 'Пароль слишком простой. Придумайте более надёжный',
    email_address_invalid: 'Некорректный email',
    user_banned: 'Аккаунт заблокирован. Свяжитесь с поддержкой',
    signup_disabled: 'Регистрация временно недоступна',
    over_request_rate_limit: 'Слишком много попыток. Попробуйте позже',
    over_email_send_rate_limit: 'Подождите немного перед повторной отправкой кода',
    otp_expired: 'Код неверен или истёк. Запросите новый.',
    request_timeout: 'Сервер не ответил вовремя. Попробуйте снова',
  };

  if (error.code && byCode[error.code]) {
    return byCode[error.code];
  }

  // Fallback for responses without an error code (older GoTrue versions)
  const message = error.message.toLowerCase();

  const byMessage: Record<string, string> = {
    'invalid login credentials': byCode.invalid_credentials,
    'email not confirmed': byCode.email_not_confirmed,
    'user already registered': byCode.user_already_exists,
    'email rate limit exceeded': 'Слишком много попыток. Попробуйте позже',
    'token has expired or is invalid': byCode.otp_expired,
    'invalid otp': 'Код неверен. Проверьте и попробуйте снова.',
  };

  if (byMessage[message]) return byMessage[message];

  // Supabase returns a dynamic wait time ("...after N seconds") that won't
  // match the map above verbatim — catch it separately.
  if (message.includes('you can only request this after')) {
    return 'Подождите немного перед повторной отправкой кода';
  }

  // Anything left is unexpected — log it so it's diagnosable from the
  // server console instead of only surfacing as a generic message.
  console.error('[auth] unmapped Supabase error', {
    name: error.name,
    code: error.code,
    status: error.status,
    message: error.message,
  });
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

  // Echoed back on failure so the email survives React's post-action form reset
  const values = { email: typeof rawData.email === 'string' ? rawData.email : '' };

  // 1. Validate & sanitize
  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: 'Проверьте введённые данные',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
      values,
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
      // Unlike the register() flow (where signUp() already triggers the
      // email), nothing has sent a code for this attempt yet — the user's
      // original code, if any, may be long expired or lost with the
      // closed tab. Request a fresh one before sending them to /confirm.
      await supabase.auth.resend({ type: 'signup', email: result.data.email });
      redirect(`/confirm?email=${encodeURIComponent(result.data.email)}`);
    }

    return { error: getAuthErrorMessage(error), values };
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

  // Echoed back on failure so these survive React's post-action form reset
  const values = {
    email: typeof rawData.email === 'string' ? rawData.email : '',
    fullName: typeof rawData.fullName === 'string' ? rawData.fullName : '',
  };

  // 1. Validate & sanitize
  const result = registerSchema.safeParse(rawData);
  if (!result.success) {
    return {
      error: 'Проверьте введённые данные',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
      values,
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
    return { error: getAuthErrorMessage(error), values };
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
    return { error: getAuthErrorMessage(error) };
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
    return { error: getAuthErrorMessage(error) };
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
