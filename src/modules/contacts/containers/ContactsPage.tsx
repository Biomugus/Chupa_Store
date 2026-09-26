// src/modules/contacts/containers/ContactsPage.tsx

import { WORKSHOP_CONTACTS } from '@/shared/config/contacts';

import type { ContactTopic } from '../types/contactTypes';
import { ContactChannels } from '../ui/ContactChannels';
import { ContactScenarios } from '../ui/ContactScenarios';
import { ContactsHero } from '../ui/ContactsHero';
import { WorkingHours } from '../ui/WorkingHours';
import ContactFormContainer from './ContactFormContainer';
import styles from './contactsPage.module.css';

type ContactsPageProps = {
  initialTopic: ContactTopic;
};

export default function ContactsPage({ initialTopic }: ContactsPageProps) {
  return (
    <main>
      <ContactsHero />

      <section className={styles.content} aria-labelledby="contacts-heading">
        <header className={styles.header}>
          <p className={styles.kicker}>Контакты</p>
          <h2 id="contacts-heading" className={styles.title}>
            Выберите удобный способ
          </h2>
          <p className={styles.subtitle}>
            Напишите в мессенджер, позвоните или оставьте заявку – и мы ответим вам в ближайшее
            время.
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Написать напрямую</h3>
            <ContactChannels contacts={WORKSHOP_CONTACTS} />
            <WorkingHours hours={WORKSHOP_CONTACTS.workingHours} />
          </div>

          <div id="contact-form" className={`${styles.column} ${styles.formColumn}`}>
            <h3 className={styles.columnTitle}>Оставить заявку</h3>
            <ContactFormContainer initialTopic={initialTopic} />
          </div>
        </div>

        <ContactScenarios />
      </section>
    </main>
  );
}
