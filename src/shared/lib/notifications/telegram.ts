// src/shared/lib/notifications/telegram.ts
//
// Канал уведомлений: сообщение в Telegram-бот мастерской.
// Только для серверного кода: читает TG_BOT_TOKEN / TG_CHAT_ID из env.

import { NOTIFICATION_TIMEOUT_MS, type ChannelResult, type OwnerNotification } from './types';

export async function sendTelegramMessage(notification: OwnerNotification): Promise<ChannelResult> {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, reason: 'misconfigured' };
  }

  const { text, linkPreviewUrl, link } = notification;

  let tgResponse: Response;

  try {
    tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        link_preview_options: linkPreviewUrl
          ? { url: linkPreviewUrl, is_disabled: false, prefer_large_media: true }
          : { is_disabled: true },
        ...(link && {
          reply_markup: {
            inline_keyboard: [[{ text: `💬 Написать в ${link.label}`, url: link.url }]],
          },
        }),
      }),
      signal: AbortSignal.timeout(NOTIFICATION_TIMEOUT_MS),
    });
  } catch (networkError) {
    // Telegram недоступен (нет сети, блокировка, таймаут) — ответа нет, status 0.
    return {
      ok: false,
      reason: 'failed',
      status: 0,
      error: String(networkError),
    };
  }

  if (!tgResponse.ok) {
    return {
      ok: false,
      reason: 'failed',
      status: tgResponse.status,
      error: await tgResponse.text(),
    };
  }

  return { ok: true };
}
