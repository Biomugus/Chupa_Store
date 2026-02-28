// src/modules/armory/api/getWeaponPlatforms.ts

import { createClient } from '@/shared/api/supabase/server';
import { WeaponPlatform } from '../types/armoryTypes';

export async function getWeaponPlatforms(platformGroup?: string): Promise<WeaponPlatform[]> {
  const supabase = await createClient();

  let query = supabase.from('weapon_platforms').select('*').order('platform_group').order('name');

  if (platformGroup) {
    query = query.eq('platform_group', platformGroup);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return data;
}
