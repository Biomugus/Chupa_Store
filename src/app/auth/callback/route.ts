// src/app/auth/callback/route.ts

import { createClient } from '@/shared/api/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth callback handler.
 * Supabase redirects here after email confirmation with a `code` query param.
 * We exchange the code for a session, then redirect the user.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const raw = searchParams.get('next') ?? '/account';
  // Prevent open redirect: only allow relative paths, block protocol-relative URLs (//evil.com)
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/account';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code is missing or exchange failed — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=Не удалось подтвердить email. Попробуйте ещё раз.`,
  );
}
