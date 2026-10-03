// src/shared/lib/notifications/types.ts

/** Уведомление владельцам мастерской о заказе или обращении с сайта. */
export type OwnerNotification = {
  /** Тема письма. */
  subject: string;
  /** Plain text без разметки — одинаково читается в Telegram, VK и почте. */
  text: string;
  /** Ссылка на контакт клиента: в Telegram — inline-кнопка «Написать в …». */
  link?: { label: string; url: string };
  /** Ссылка, для которой Telegram покажет превью под сообщением. */
  linkPreviewUrl?: string;
};

export type ChannelResult =
  | { ok: true }
  /** Не заданы env канала — канал выключен, это не ошибка. */
  | { ok: false; reason: 'misconfigured' }
  /** status — HTTP-статус ответа сервиса, 0 — сервис недоступен или не ответил. */
  | { ok: false; reason: 'failed'; status: number; error: string };

export type NotificationChannel = 'telegram' | 'vk' | 'email';

export type ChannelStatus = 'ok' | 'skipped' | 'failed';

/** Итог по каналам — сохраняется в колонку `notifications` заказа/обращения. */
export type NotificationSummary = Record<NotificationChannel, ChannelStatus>;

// Без таймаута запрос к заблокированному или зависшему сервису висит минутами.
export const NOTIFICATION_TIMEOUT_MS = 10 * 1000;
