// src/shared/lib/telegram.ts
//
// Отправка сообщений в Telegram-бот мастерской (заказы, обращения с сайта).
// Только для серверного кода: читает TG_BOT_TOKEN / TG_CHAT_ID из env.

export type TelegramMessage = {
  text: string;
  /** Ссылка, для которой Telegram покажет превью под сообщением. */
  linkPreviewUrl?: string;
  /** Inline-кнопка под сообщением. */
  button?: { text: string; url: string };
};

export type TelegramSendResult =
  | { ok: true }
  | { ok: false; reason: 'misconfigured' }
  | { ok: false; reason: 'failed'; status: number; error: string };

// Без таймаута запрос к заблокированному или зависшему api.telegram.org висит
// минутами, а вместе с ним — ответ клиенту. Должен быть меньше таймаута httpClient.
const TELEGRAM_TIMEOUT_MS = 10 * 1000;

export async function sendTelegramMessage(message: TelegramMessage): Promise<TelegramSendResult> {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, reason: 'misconfigured' };
  }

  const { text, linkPreviewUrl, button } = message;

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
        ...(button && {
          reply_markup: { inline_keyboard: [[{ text: button.text, url: button.url }]] },
        }),
      }),
      signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
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
