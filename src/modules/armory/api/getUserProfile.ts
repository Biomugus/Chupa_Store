// src/modules/armory/api/getUserProfile.ts

import { createClient } from '@/shared/api/supabase/server';
import { UserProfile } from '../types/armoryTypes';

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (error || !data) return null;

  return data;
}
