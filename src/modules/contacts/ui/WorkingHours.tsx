// src/modules/contacts/ui/WorkingHours.tsx

import { Clock } from 'lucide-react';

import type { WorkshopContacts } from '@/shared/config/contacts';

import styles from './contactChannels.module.css';

type WorkingHoursProps = {
  hours: WorkshopContacts['workingHours'];
};

/** Тот же вид, что у карточек телефона/email. */
export function WorkingHours({ hours }: WorkingHoursProps) {
  return (
    <div className={styles.card}>
      <span className={`${styles.iconSlot} ${styles.iconSlotAccent}`}>
        <Clock className={styles.lineIcon} aria-hidden="true" />
      </span>
      <span className={styles.texts}>
        <span className={styles.title}>Время работы мастерской</span>
        <span className={styles.value}>
          {hours.days}, {hours.time} ({hours.timezone})
        </span>
        <span className={styles.subtitle}>
          Писать можно в любое время – ответим в рабочие часы.
        </span>
      </span>
    </div>
  );
}
