// src/shared/config/contacts.ts
//
// Единый источник контактов мастерской и разработчика: используется футером
// и страницей /contacts, чтобы ссылки не расходились между местами.

export const WORKSHOP_CONTACTS = {
  whatsapp: {
    url: 'https://wa.me/79997101148',
  },
  telegram: {
    url: 'https://t.me/chupa_workshop',
    handle: '@chupa_workshop',
  },
  vk: {
    url: 'https://vk.com/starinachupa',
  },
  phone: {
    display: '+7 999 710-11-48',
    href: 'tel:+79997101148',
  },
  // TODO: заменить на реальный адрес почты мастерской.
  email: {
    display: 'master@chupa-workshop.ru',
    href: 'mailto:master@chupa-workshop.ru',
  },
  // TODO: уточнить реальный график работы мастерской.
  workingHours: {
    days: 'Пн–Пт',
    time: '10:00–19:00',
    timezone: 'МСК',
  },
} as const;

export const DEVELOPER_CONTACTS = {
  whatsapp: { url: 'https://wa.me/+79017103886' },
  telegram: { url: 'https://t.me/+79017103886' },
  vk: { url: 'https://vk.com/chupakhincoach' },
} as const;

export type WorkshopContacts = typeof WORKSHOP_CONTACTS;
