// src/modules/contacts/ui/ContactsHero.tsx

import Image from 'next/image';

import styles from './contactsHero.module.css';

export function ContactsHero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/contacts/hero.jpg"
        alt=""
        fill
        priority
        quality={80}
        className={styles.heroImage}
        sizes="100vw"
      />

      <div className={styles.content}>
        <p className={styles.label}>Мастерская Чупы</p>
        <h1 className={styles.title}>Связаться с нами</h1>
        <p className={styles.subtitle}>
          Поможем с выбором изделия, обсудим кастомный проект, сотрудничество или детали заказа.
        </p>
      </div>
    </section>
  );
}
