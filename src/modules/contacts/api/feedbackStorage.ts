// src/modules/contacts/api/feedbackStorage.ts
//
// Хранение обращений в Supabase (таблица feedback_requests, миграция 008).
// Только сервер: пишет через admin-клиент, потому что RLS закрывает таблицу для anon.

import type { NotificationSummary } from '@/shared/lib/notifications';
import { createAdminClient } from '@/shared/api/supabase/admin';
import type { ContactFormSchema } from '../model/contactFormSchema';

export type SaveFeedbackResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveFeedback(payload: ContactFormSchema): Promise<SaveFeedbackResult> {
  const { data, error } = await createAdminClient()
    .from('feedback_requests')
    .insert({
      name: payload.name,
      contact: payload.contact,
      topic: payload.topic,
      message: payload.message,
    })
    .select('id')
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data.id };
}

export async function setFeedbackNotifications(id: string, summary: NotificationSummary) {
  const { error } = await createAdminClient()
    .from('feedback_requests')
    .update({ notifications: summary })
    .eq('id', id);

  if (error) {
    console.error('Failed to save feedback notification status', { id, summary, error });
  }
}
