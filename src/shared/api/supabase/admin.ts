// src/shared/api/supabase/admin.ts

import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client with the service_role key — bypasses RLS.
 * Server-only: route handlers and server actions that write tables closed by
 * RLS (orders, feedback_requests). Never import it in client components —
 * `SUPABASE_SERVICE_ROLE_KEY` has no NEXT_PUBLIC_ prefix and is not exposed
 * to the browser, so the client would not work there anyway.
 *
 * No cookies and no session: requests go on behalf of the service, not the user.
 */
export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
