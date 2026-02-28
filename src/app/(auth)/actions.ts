'use server';

// src/app/(auth)/actions.ts

import { AuthActionResult } from '@/modules/auth/types/authTypes';
import { loginSchema, registerSchema } from '@/modules/auth/validation/authSchemas';
import { createClient } from '@/shared/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Maps Supabase Auth error messages to user-friendly Russian strings.
 * Keeps security in mind: no specific "user not found" messages.
 */
function getAuthErrorMessage(error: string): string {
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
  };

  return errorMap[error.toLowerCase()] ?? 'Произошла ошибка. Попробуйте позже';
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
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
      data: {
        full_name: result.data.fullName,
      },
    },
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[Register] Supabase error:', error.message, error.status, error.code);
    return { error: getAuthErrorMessage(error.message) };
  }

  // 3. Supabase sends confirmation email automatically
  return {
    success:
      'Регистрация почти завершена! Проверьте почту и перейдите по ссылке для подтверждения.',
  };
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
