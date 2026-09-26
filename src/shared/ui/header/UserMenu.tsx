// src/shared/ui/header/UserMenu.tsx

'use client';

import { logout } from '@/app/(auth)/actions';
import { createClient } from '@/shared/api/supabase/client';
import { getAvatarInitial } from '@/shared/lib/getAvatarInitial';
import type { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';

/**
 * User menu component for the Header.
 * Shows a "Login" icon for guests, or a user avatar with dropdown for authenticated users.
 * Subscribes to auth state changes via Supabase browser client.
 */
export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Avoid hydration mismatch
  if (!mounted) return null;

  // Guest: show login link
  if (!user) {
    return (
      <a href="/login" className={styles.userButton} aria-label="Войти в аккаунт">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </a>
    );
  }

  // Authenticated: show avatar + dropdown
  const initials = getAvatarInitial(user.user_metadata?.full_name, user.email);

  return (
    <div ref={menuRef} className={styles.userMenuWrapper}>
      <button
        type="button"
        className={styles.userAvatar}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Меню пользователя"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {initials}
      </button>

      {isOpen && (
        <div className={styles.userDropdown} role="menu">
          <div className={styles.userDropdownEmail}>{user.email}</div>
          <div className={styles.userDropdownDivider} />
          <a
            href="/account"
            className={styles.userDropdownItem}
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Мой аккаунт
          </a>
          <form action={logout}>
            <button type="submit" className={styles.userDropdownItem} role="menuitem">
              Выйти
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
