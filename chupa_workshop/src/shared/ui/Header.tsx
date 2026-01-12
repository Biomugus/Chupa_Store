'use client';

import Link from 'next/link';
import { useIconsReady } from '../hooks/useIconsReady';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useModal } from './ModalContext';

import { CartIcon } from '../icons/Carticon';
import { LogoMark } from '../icons/LogoMark';

import { useState } from 'react';
import { HOME_LABEL, NAV_ITEMS } from '../config/navigation';
import styles from './Header.module.css';
import { MenuToggle } from './MenuToggle';

const NAVIGATION_ID = 'main-navigation';

function Header() {
  const iconsReady = useIconsReady();
  const menu = useMobileMenu();
  const { openModal } = useModal();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href === '/' || href === '/catalog') return;
  
    e.preventDefault();
    menu.close();
    openModal('nav');
  };
  

  const navigationItems = NAV_ITEMS.map((item) => (
    <li key={item.href} className={styles.navItem}>
      <Link
        href={item.href}
        className={styles.navLink}
        onClick={(e) => handleNavClick(e, item.href)}
        prefetch={false}
      >
        {item.label}
      </Link>
    </li>
  ));

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.inner}>
          <MenuToggle isOpen={menu.isOpen} onToggle={menu.toggle} ariaControls={NAVIGATION_ID} />

          <nav
            id={NAVIGATION_ID}
            className={styles.nav}
            aria-label="Основные разделы"
            data-open={menu.isOpen}
          >
            <ul className={styles.navList}>{navigationItems}</ul>
          </nav>

          <Link href="/" className={styles.logo} aria-label={HOME_LABEL} prefetch={false}>
            <LogoMark ready={iconsReady} />
          </Link>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cartButton}
              aria-label="Открыть корзину"
              onClick={() => {
                menu.close();
                openModal('cart');
              }}
            >
              <CartIcon ready={iconsReady} />
              <span className={styles.srOnly}>Корзина</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
