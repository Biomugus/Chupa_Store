// src/shared/hooks/useIsGuest.ts

'use client';

import { createClient } from '@/shared/api/supabase/client';
import { useEffect, useState } from 'react';

export function useIsGuest() {
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsGuest(!user);
    });
  }, []);

  return isGuest;
}
