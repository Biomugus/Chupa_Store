// src/shared/lib/notifications/index.ts
//
// Уведомления владельцам о заказах и обращениях. Каналы независимы и
// best-effort: заказ к этому моменту уже сохранён в Supabase, поэтому сбой
// любого канала только логируется и попадает в итог по каналам.

import { sendEmail } from './email';
import { sendTelegramMessage } from './telegram';
import type {
  ChannelResult,
  ChannelStatus,
  NotificationChannel,
  NotificationSummary,
  OwnerNotification,
} from './types';
import { sendVkMessage } from './vk';

export type { NotificationSummary, OwnerNotification } from './types';

const CHANNELS: Record<NotificationChannel, (n: OwnerNotification) => Promise<ChannelResult>> = {
  telegram: sendTelegramMessage,
  vk: sendVkMessage,
  email: sendEmail,
};

function toStatus(result: PromiseSettledResult<ChannelResult>): ChannelStatus {
  if (result.status === 'rejected') return 'failed';
  if (result.value.ok) return 'ok';
  return result.value.reason === 'misconfigured' ? 'skipped' : 'failed';
}

/**
 * Отправляет уведомление во все настроенные каналы параллельно. Не бросает:
 * каналы без env — `skipped`, упавшие — `failed` (с записью в лог).
 */
export async function notifyOwner(notification: OwnerNotification): Promise<NotificationSummary> {
  const names = Object.keys(CHANNELS) as NotificationChannel[];
  const results = await Promise.allSettled(names.map((name) => CHANNELS[name](notification)));

  const summary = {} as NotificationSummary;

  names.forEach((name, index) => {
    const result = results[index];
    summary[name] = toStatus(result);

    if (summary[name] === 'failed') {
      console.error(`Failed to send notification via ${name}`, {
        subject: notification.subject,
        error: result.status === 'rejected' ? String(result.reason) : result.value,
      });
    }
  });

  if (names.every((name) => summary[name] === 'skipped')) {
    console.error('No notification channels configured: set TG_*, VK_* or SMTP_* env', {
      subject: notification.subject,
    });
  }

  return summary;
}
