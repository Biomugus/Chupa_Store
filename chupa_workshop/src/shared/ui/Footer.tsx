'use client';

import Link from 'next/link';
import { useState } from 'react';

import { BRAND_NAME } from '../config/navigation';
import { useIconsReady } from '../hooks/useIconsReady';
import { LogoMark } from '../icons/LogoMark';
import { RuFlag } from '../icons/RuFlag';
import { TelegramIcon } from '../icons/TelegramIcon';
import { VkIcon } from '../icons/VkIcon';
import { WhatsappIcon } from '../icons/WhatsappIcon';

import styles from './Footer.module.css';

type FooterSectionId = 'shop' | 'support' | 'workshop';

type FooterSectionConfig = {
  id: FooterSectionId;
  title: string;
  items: FooterItem[];
};

const FOOTER_SECTIONS: FooterSectionConfig[] = [
  {
    id: 'shop',
    title: 'Магазин',
    items: [
      { label: 'Каталог', href: '/catalog' },
      { label: 'Цевья', href: '/grips' },
      { label: 'Рукоятки', href: '/forearm' },
      { label: 'Приклады', href: '/stocks' },
      { label: 'Mlok-комплектующие', href: '/mlok' },
      { label: 'Кастомные проекты', href: '/customs' },
    ],
  },
  {
    id: 'support',
    title: 'Помощь',
    items: [
      { label: 'Связаться с нами', href: '/contacts' },
      { label: 'Сообщить о браке', href: '/issues' },
      { label: 'Для партнеров', href: '/forPartners' },
    ],
  },
  {
    id: 'workshop',
    title: 'Мастерская',
    items: [
      { label: 'История', href: '/history' },
      { label: 'Миссия', href: '/mission' },
      { label: 'О процессе работы', href: '/process' },
    ],
  },
];

type FooterSectionProps = {
  config: FooterSectionConfig;
  isOpen: boolean;
  onToggle: () => void;
};

type FooterItem = {
  label: string;
  href: string;
};

function FooterSection({ config, isOpen, onToggle }: FooterSectionProps) {
  const items = config.items.map((item) => (
    <li key={item.href} className={styles.sectionItem}>
      <Link href={item.href} className={styles.footerLink}>
        {item.label}
      </Link>
    </li>
  ));

  return (
    <section
      className={`${styles.section} ${isOpen ? (styles.sectionOpen ?? '') : ''}`}
      aria-label={config.title}
    >
      <button
        type="button"
        className={styles.sectionHeader}
        aria-expanded={isOpen}
        aria-controls={`${config.id}-content`}
        onClick={onToggle}
      >
        <span className={styles.sectionTitle}>{config.title}</span>
        <span className={styles.sectionChevron} aria-hidden="true">
          <span className={styles.chevronIcon} />
        </span>
      </button>

      <div
        id={`${config.id}-content`}
        className={`${styles.sectionBody} ${isOpen ? (styles.sectionBodyOpen ?? '') : ''}`}
      >
        <ul className={styles.sectionList}>{items}</ul>
      </div>
    </section>
  );
}

export function Footer() {
  const [openId, setOpenId] = useState<FooterSectionId | null>(null);
  const iconsReady = useIconsReady();

  const handleToggle = (id: FooterSectionId) => {
    setOpenId((current) => (current === id ? null : id));
  };

  const sections = FOOTER_SECTIONS.map((section) => (
    <FooterSection
      key={section.id}
      config={section}
      isOpen={openId === section.id}
      onToggle={() => handleToggle(section.id)}
    />
  ));

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Подвал сайта">
      <div className={styles.inner}>
        <div className={styles.columns}>
          {sections}

          <aside className={styles.brandColumn} aria-label="Информация о бренде">
            <div className={styles.brandLogo}>
              <LogoMark ready={iconsReady} />
            </div>

            <p className={styles.brandText}>Сделано в России</p>

            <div className={styles.brandFlagRow}>
              <RuFlag />
            </div>
          </aside>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.bottomLeft}>
            <span>
              © {currentYear} {BRAND_NAME}
            </span>

            <div className={styles.devRow}>
              <span className={styles.pill}>Приложение разработано - ИП Чупахин С. А.</span>

              <div className={styles.devIcons}>
                <a
                  href="https://wa.me/+79017103886"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в WhatsApp разработчику"
                >
                  <WhatsappIcon className={styles.devIcon} />
                </a>
                <a
                  href="https://t.me/+79017103886"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Написать в Telegram разработчику"
                >
                  <TelegramIcon className={styles.devIcon} />
                </a>
                <a
                  href="https://vk.com/chupakhincoach"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Профиль разработчика ВКонтакте"
                >
                  <VkIcon className={styles.devIcon} />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.bottomRight}>
            <span>Контакты Мастерской</span>
            <div className={styles.badgeRow} aria-label="Мессенджеры">
              <a
                href="https://wa.me/79997101148"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.badge}
                aria-label="Написать в WhatsApp"
              >
                <WhatsappIcon className={styles.badgeIcon} />
              </a>
              <a
                href="https://t.me/chupa_workshop"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.badge}
                aria-label="Написать в Telegram"
              >
                <TelegramIcon className={styles.badgeIcon} />
              </a>
              <a
                href="https://vk.com/starinachupa"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.badge}
                aria-label="Открыть группу ВКонтакте"
              >
                <VkIcon className={styles.badgeIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
