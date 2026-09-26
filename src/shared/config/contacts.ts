// src/shared/config/contacts.ts
//
// Единый источник контактов мастерской и разработчика: используется футером
// и страницей /contacts, чтобы ссылки не расходились между местами.

export const WORKSHOP_CONTACTS = {
  whatsapp: {
    url: 'https://wa.me/79017103886',
  },
  telegram: {
    url: 'https://t.me/chupa_workshop',
    handle: '@chupa_workshop',
  },
  vk: {
    url: 'https://vk.com/starinachupa',
  },
  phone: {
    display: '+7 901 710-38-86',
    href: 'tel:+79017103886',
  },

  email: {
    display: 'chupa-workshop@mail.ru',
    href: 'mailto:chupa-workshop@mail.ru',
  },

  workingHours: {
    days: 'Пн–Пт',
    time: '09:00–18:00',
    timezone: 'МСК',
  },
} as const;

export const DEVELOPER_CONTACTS = {
  telegram: { url: 'https://t.me/+79017103886' },
} as const;

export type WorkshopContacts = typeof WORKSHOP_CONTACTS;
