// src/modules/armory/types/armoryTypes.ts

import { Database } from '@/types/supabase';

export type WeaponPlatform = Database['public']['Tables']['weapon_platforms']['Row'];

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export type CompatibilityStatus = Database['public']['Enums']['compatibility_status'];
