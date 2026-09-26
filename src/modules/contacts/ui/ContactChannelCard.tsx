// src/modules/contacts/ui/ContactChannelCard.tsx

import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { CopyButton } from './CopyButton';
import styles from './contactChannels.module.css';

type BaseProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

type LinkCardProps = BaseProps & {
  href: string;
  /** Для aria-label ссылки, например «Написать в Telegram». */
  ariaLabel: string;
};

/** Карточка-ссылка на мессенджер: вся карточка кликабельна. */
export function ContactLinkCard({ icon, title, subtitle, href, ariaLabel }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.card} ${styles.cardLink}`}
      aria-label={`${ariaLabel} (откроется в новой вкладке)`}
    >
      <span className={styles.iconSlot}>{icon}</span>
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
      <ChevronRight className={styles.chevron} aria-hidden="true" />
    </a>
  );
}

type CopyCardProps = BaseProps & {
  value: string;
  href: string;
  copyLabel: string;
};

/**
 * Телефон/email: значение — ссылка (tel:/mailto:), рядом кнопка копирования —
 * на десктопе tel: часто бесполезен.
 */
export function ContactCopyCard({ icon, title, subtitle, value, href, copyLabel }: CopyCardProps) {
  return (
    <div className={styles.card}>
      <span className={`${styles.iconSlot} ${styles.iconSlotAccent}`}>{icon}</span>
      <span className={styles.texts}>
        <span className={styles.title}>{title}</span>
        <a href={href} className={styles.value}>
          {value}
        </a>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
      <CopyButton value={value} label={copyLabel} />
    </div>
  );
}
