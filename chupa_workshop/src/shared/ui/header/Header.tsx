'use client';

import { observer } from 'mobx-react-lite';

import { useIconsReady } from '@/shared/hooks/useIconsReady';
import { useMobileMenu } from '@/shared/hooks/useMobileMenu';
import { useCart } from '@/modules/cart/hooks/useCart';
import Link from 'next/link';
import { useModal } from '../modal/ModalContext';

import { CartIcon } from '@/shared/icons/Carticon';
import { LogoMark } from '@/shared/icons/LogoMark';

import { HOME_LABEL, NAV_ITEMS } from '@/shared/config/navigation';
import { MenuToggle } from '../MenuToggle';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

const NAVIGATION_ID = 'main-navigation';

const Header = observer(function Header() {
  const iconsReady = useIconsReady();
  const menu = useMobileMenu();
  const { openModal } = useModal();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
              {mounted && totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
              <span className={styles.srOnly}>Корзина</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
});

export default Header;
