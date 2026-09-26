// src/modules/contacts/ui/ContactChannels.tsx

import { Mail, Phone } from 'lucide-react';

import type { WorkshopContacts } from '@/shared/config/contacts';
import { TelegramIcon } from '@/shared/icons/TelegramIcon';
import { VkIcon } from '@/shared/icons/VkIcon';
import { WhatsappIcon } from '@/shared/icons/WhatsappIcon';

import { ContactCopyCard, ContactLinkCard } from './ContactChannelCard';
import styles from './contactChannels.module.css';

type ContactChannelsProps = {
  contacts: WorkshopContacts;
};

export function ContactChannels({ contacts }: ContactChannelsProps) {
  return (
    <ul className={styles.list}>
      <li>
        <ContactLinkCard
          icon={<TelegramIcon className={styles.brandIcon} />}
          title="Telegram"
          subtitle={contacts.telegram.handle}
          href={contacts.telegram.url}
          ariaLabel="Написать в Telegram"
        />
      </li>
      <li>
        <ContactLinkCard
          icon={<WhatsappIcon className={styles.brandIcon} />}
          title="WhatsApp"
          subtitle="Написать в WhatsApp"
          href={contacts.whatsapp.url}
          ariaLabel="Написать в WhatsApp"
        />
      </li>
      <li>
        <ContactLinkCard
          icon={<VkIcon className={styles.brandIcon} />}
          title="ВКонтакте"
          subtitle="Сообщество мастерской"
          href={contacts.vk.url}
          ariaLabel="Открыть сообщество ВКонтакте"
        />
      </li>
      <li>
        <ContactCopyCard
          icon={<Phone className={styles.lineIcon} aria-hidden="true" />}
          title="Телефон"
          value={contacts.phone.display}
          href={contacts.phone.href}
          subtitle="Звонки в рабочие часы"
          copyLabel="номер телефона"
        />
      </li>
      <li>
        <ContactCopyCard
          icon={<Mail className={styles.lineIcon} aria-hidden="true" />}
          title="Email"
          value={contacts.email.display}
          href={contacts.email.href}
          subtitle="Ответим в течение рабочего дня"
          copyLabel="адрес почты"
        />
      </li>
    </ul>
  );
}
