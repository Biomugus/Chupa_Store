// src/shared/api/supabase/client.ts

import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for browser-side (client components).
 * Uses `createBrowserClient` from @supabase/ssr, which automatically
 * manages cookies and session refresh in the browser context.
 *
 * Usage: import in `'use client'` components for auth state listeners,
 * realtime subscriptions, and client-side data fetching.
 */
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
