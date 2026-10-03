// src/modules/contacts/utils/feedbackTextBuilder.ts
//
// Текст обращения для уведомлений (Telegram, VK, почта). Plain text: в Telegram
// сообщение уходит без parse_mode, поэтому пользовательский ввод не
// интерпретируется как разметка.

import { CONTACT_TOPIC_LABELS } from '../model/contactTopics';
import type { ContactFormSchema } from '../model/contactFormSchema';

type ContactLink = { url: string; label: string };

/** Ссылка «Написать» (inline-кнопка в Telegram, строка в письме): только для Telegram и VK (tel:/mailto: Telegram не принимает). */
export function getContactLink(contact: string): ContactLink | null {
  const value = contact.trim();

  if (/^@[a-zA-Z0-9_]{5,32}$/.test(value)) {
    return { url: `https://t.me/${value.slice(1)}`, label: 'Telegram' };
  }

  const profile = value.match(
    /^(?:https?:\/\/)?(?:www\.)?(t\.me|(?:m\.)?vk\.(?:com|ru))\/([\w.]+)\/?$/i,
  );
  if (profile) {
    const [, host, path] = profile;
    const isTelegram = host.toLowerCase() === 't.me';
    return {
      url: `https://${host.toLowerCase()}/${path}`,
      label: isTelegram ? 'Telegram' : 'VK',
    };
  }

  return null;
}

export function buildFeedbackData(payload: ContactFormSchema) {
  const text = `
📩 ОБРАЩЕНИЕ С САЙТА · ${CONTACT_TOPIC_LABELS[payload.topic]}

👤 Имя: ${payload.name}
📞 Контакт: ${payload.contact}

💬 Сообщение:
${payload.message}
`.trim();

  return { text, contactLink: getContactLink(payload.contact) };
}
