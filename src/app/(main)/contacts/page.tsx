import type { Metadata } from 'next';

import { ContactsPage, parseTopic } from '@/modules/contacts';

export const metadata: Metadata = {
  title: 'Контакты — Мастерская Чупы',
  description:
    'Свяжитесь с Мастерской Чупы: Telegram, WhatsApp, ВКонтакте, телефон и email. Поможем с выбором, обсудим кастомный проект или сотрудничество.',
};

type ContactsRouteProps = {
  searchParams: Promise<{ topic?: string | string[] }>;
};

export default async function Page({ searchParams }: ContactsRouteProps) {
  const { topic } = await searchParams;

  return <ContactsPage initialTopic={parseTopic(topic)} />;
}
