'use server';

// src/modules/armory/api/updateUserPlatform.ts

import { createClient } from '@/shared/api/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const platformIdSchema = z.string().uuid().nullable();

export interface UpdatePlatformResult {
  error?: string;
  success?: string;
}
export async function updateUserPlatform(platformId: string | null): Promise<UpdatePlatformResult> {
  const parsed = platformIdSchema.safeParse(platformId);
  if (!parsed.success) {
    return { error: 'Некорректный идентификатор платформы' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Необходимо войти в аккаунт' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ selected_platform_id: platformId })
    .eq('id', user.id);

  if (error) {
    console.error('[updateUserPlatform] Supabase error:', error.message);
    return { error: 'Не удалось сохранить платформу. Попробуйте позже' };
  }
  revalidatePath('/account');
  revalidatePath('/catalog');

  return { success: 'Платформа сохранена' };
}
