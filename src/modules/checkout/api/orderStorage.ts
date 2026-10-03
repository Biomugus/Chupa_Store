// src/modules/checkout/api/orderStorage.ts
//
// Хранение заказов в Supabase (таблица orders, миграция 008). Только сервер:
// пишет через admin-клиент, потому что RLS закрывает таблицу для anon.

import type { NotificationSummary } from '@/shared/lib/notifications';
import { createAdminClient } from '@/shared/api/supabase/admin';
import type { OrderPayload } from '../types/checkoutTypes';

// Код Postgres для нарушения уникальности — здесь client_request_id.
const UNIQUE_VIOLATION = '23505';

export type SaveOrderResult =
  | { ok: true; id: string; /** false — заказ с таким clientRequestId уже был. */ created: boolean }
  | { ok: false; error: string };

/**
 * Сохраняет заказ. Повтор с тем же `clientRequestId` («Повторить попытку»
 * после обрыва сети) не создаёт дубль и возвращает уже сохранённый заказ.
 */
export async function saveOrder(payload: OrderPayload): Promise<SaveOrderResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      client_request_id: payload.clientRequestId,
      customer: payload.customer,
      delivery_service: payload.delivery.service,
      payment_method: payload.payment.method,
      items: payload.items,
      total: payload.total,
    })
    .select('id')
    .single();

  if (!error) {
    return { ok: true, id: data.id, created: true };
  }

  if (error.code !== UNIQUE_VIOLATION) {
    return { ok: false, error: error.message };
  }

  const existing = await supabase
    .from('orders')
    .select('id')
    .eq('client_request_id', payload.clientRequestId)
    .single();

  if (existing.error) {
    return { ok: false, error: existing.error.message };
  }

  return { ok: true, id: existing.data.id, created: false };
}

export async function setOrderNotifications(id: string, summary: NotificationSummary) {
  const { error } = await createAdminClient()
    .from('orders')
    .update({ notifications: summary })
    .eq('id', id);

  if (error) {
    console.error('Failed to save order notification status', { id, summary, error });
  }
}
