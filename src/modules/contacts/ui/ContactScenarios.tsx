// src/modules/contacts/ui/ContactScenarios.tsx

import { Handshake, Hammer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import btnStyles from '@/shared/ui/buttons/buttons.module.css';

import type { ContactTopic } from '../types/contactTypes';
import styles from './contactScenarios.module.css';

const SCENARIOS: {
  topic: ContactTopic;
  icon: typeof Hammer;
  title: string;
  text: string;
  cta: string;
  image: string;
}[] = [
  {
    topic: 'custom',
    icon: Hammer,
    title: 'Кастомный проект',
    text: 'Воплотим вашу идею: подберём породу дерева, внешний вид и декоративную резьбу под вашу платформу.',
    cta: 'Обсудить проект',
    image: '/images/process/process.jpg',
  },
  {
    topic: 'partnership',
    icon: Handshake,
    title: 'Для партнёров',
    text: 'Открыты к сотрудничеству с магазинами, стрелковыми клубами и мастерскими.',
    cta: 'Предложить сотрудничество',
    image: '/images/cta/cta1.jpg',
  },
];

export function ContactScenarios() {
  return (
    <ul className={styles.list}>
      {SCENARIOS.map(({ topic, icon: Icon, title, text, cta, image }) => (
        <li key={topic} className={styles.card}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className={styles.image}
          />
          <div className={styles.content}>
            <Icon className={styles.icon} aria-hidden="true" />
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.text}>{text}</p>
            <Link
              href={`/contacts?topic=${topic}#contact-form`}
              className={`${btnStyles.btnGradientPrimary} ${styles.cta}`}
            >
              {cta}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
