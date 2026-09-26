// src/proxy.ts

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Routes that require authentication.
 * Unauthenticated users will be redirected to /login.
 */
const PROTECTED_ROUTES = ['/account', '/onboarding', '/reset-password'];

/**
 * Auth routes that authenticated users should NOT access.
 * They will be redirected to /account instead.
 */
const AUTH_ROUTES = ['/login', '/register', '/confirm', '/forgot-password'];

/**
 * Security headers to apply to all responses.
 * Protects against common web attacks (XSS, clickjacking, MIME sniffing).
 */
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://suggestions.dadata.ru; " +
    "frame-ancestors 'none';",
};

/**
 * Checks if the current path starts with any of the given route prefixes.
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Updates the Supabase session by refreshing tokens if needed.
 * This is the core of the "silent refresh" mechanism:
 * - If access token is valid → passes through
 * - If access token expired but refresh token is valid → auto-refreshes
 * - If both tokens expired → user is null (guest)
 */
async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1. Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          // 2. Create a new response with the updated request
          supabaseResponse = NextResponse.next({ request });

          // 3. Set cookies on the response (for the browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Do NOT use getSession() — it reads from the JWT without
  // verifying with Supabase servers. getUser() actually validates the token
  // and triggers the refresh flow if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes: redirect unauthenticated users to login
  if (!user && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes: redirect authenticated users to account
  if (user && matchesRoute(pathname, AUTH_ROUTES)) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = '/account';
    return NextResponse.redirect(accountUrl);
  }

  return supabaseResponse;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = await updateSession(request);

  // Apply security headers to every response
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - Public assets (svg, png, jpg, etc.)
     * - API routes that handle their own auth
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};
