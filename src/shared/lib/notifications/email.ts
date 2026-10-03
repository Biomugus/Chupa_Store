// src/shared/lib/notifications/email.ts
//
// Канал уведомлений: письмо на рабочую почту через SMTP (Яндекс 360, Mail.ru
// и т. п.). Только для серверного кода.
//
// SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS — ящик-отправитель (пароль
// приложения, не основной пароль); NOTIFY_EMAIL_TO — получатели через запятую.

import nodemailer from 'nodemailer';
import { NOTIFICATION_TIMEOUT_MS, type ChannelResult, type OwnerNotification } from './types';

const DEFAULT_SMTP_PORT = 465;

export async function sendEmail(notification: OwnerNotification): Promise<ChannelResult> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_EMAIL_TO;

  if (!host || !user || !pass || !to) {
    return { ok: false, reason: 'misconfigured' };
  }

  const port = Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT;

  const transport = nodemailer.createTransport({
    host,
    port,
    // 465 — TLS сразу, 587 — STARTTLS после подключения.
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: NOTIFICATION_TIMEOUT_MS,
    greetingTimeout: NOTIFICATION_TIMEOUT_MS,
    socketTimeout: NOTIFICATION_TIMEOUT_MS,
  });

  const { subject, text, link } = notification;

  try {
    await transport.sendMail({
      // Яндекс и Mail.ru отклоняют письма, где From не совпадает с ящиком авторизации.
      from: { name: 'Chupa Workshop', address: user },
      to,
      subject,
      text: link ? `${text}\n\n💬 Написать в ${link.label}: ${link.url}` : text,
    });
  } catch (smtpError) {
    // SMTP-код ответа (535 — неверный пароль и т. п.), если сервер ответил.
    const responseCode = (smtpError as { responseCode?: number } | null)?.responseCode;
    return {
      ok: false,
      reason: 'failed',
      status: responseCode ?? 0,
      error: String(smtpError),
    };
  }

  return { ok: true };
}
