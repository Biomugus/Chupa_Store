// src/modules/contacts/model/contactFormSchema.ts
//
// Общая схема для клиента (форма на /contacts) и сервера (POST /api/feedback).

import { z } from 'zod';
import { CONTACT_TOPIC_VALUES } from './contactTopics';

export const MESSAGE_MAX_LENGTH = 2000;

const phoneRegex = /^\+?[\d\s()-]{10,20}$/;
const telegramRegex = /^@[a-zA-Z0-9_]{5,32}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// VK — и vk.com, и vk.ru (приложение VK копирует ссылки уже на vk.ru), в том числе мобильные m.vk.*.
const profileLinkRegex = /^(https?:\/\/)?(www\.)?(t\.me|(m\.)?vk\.(com|ru))\/[\w.]+\/?$/i;

/** Телефон, @username, email или ссылка на t.me / vk.com / vk.ru. */
export function isValidContact(value: string): boolean {
  if (phoneRegex.test(value)) {
    return value.replace(/\D/g, '').length >= 10;
  }
  return telegramRegex.test(value) || emailRegex.test(value) || profileLinkRegex.test(value);
}

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Как к вам обращаться?').max(60, 'Не больше 60 символов'),
  contact: z
    .string()
    .trim()
    .min(1, 'Оставьте контакт для ответа')
    .max(100, 'Не больше 100 символов')
    .refine(isValidContact, 'Укажите телефон, @username в Telegram или email'),
  topic: z.enum(CONTACT_TOPIC_VALUES, 'Выберите тему'),
  message: z
    .string()
    .trim()
    .min(10, 'Опишите вопрос хотя бы в паре слов')
    .max(MESSAGE_MAX_LENGTH, `Не больше ${MESSAGE_MAX_LENGTH} символов`),
  website: z.string().optional(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
