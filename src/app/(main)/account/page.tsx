// src/app/(main)/account/page.tsx

import { logout } from '@/app/(auth)/actions';
import { getUserProfile } from '@/modules/armory/api/getUserProfile';
import { getWeaponPlatforms } from '@/modules/armory/api/getWeaponPlatforms';
import { WeaponSelector } from '@/modules/armory/components/WeaponSelector/WeaponSelector';
import { createClient } from '@/shared/api/supabase/server';
import { getAvatarInitial } from '@/shared/lib/getAvatarInitial';
import { redirect } from 'next/navigation';
import styles from './account.module.css';

export const metadata = {
  title: 'Мой аккаунт — Мастерская Чупы',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profile, platforms] = await Promise.all([getUserProfile(), getWeaponPlatforms()]);

  const displayName = profile?.full_name ?? user.user_metadata?.full_name ?? null;
  const selectedPlatform = platforms.find((p) => p.id === profile?.selected_platform_id) ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Мой аккаунт</h1>

        {/* ── Profile Section ── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Профиль
          </h2>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>{getAvatarInitial(displayName, user.email)}</div>
            <div className={styles.profileDetails}>
              {displayName && <p className={styles.profileName}>{displayName}</p>}
              <p className={styles.profileEmail}>{user.email}</p>
            </div>
          </div>
        </section>

        {/* ── Arsenal Section ── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <svg
              className={styles.cardIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h6l3-9 3 9h6" />
              <path d="M22 12l-3 9H5l-3-9" />
            </svg>
            Мой арсенал
          </h2>

          {selectedPlatform ? (
            <div className={styles.currentPlatform}>
              <div>
                <p className={styles.currentPlatformLabel}>Текущая платформа</p>
                <p className={styles.currentPlatformName}>{selectedPlatform.name}</p>
              </div>
            </div>
          ) : (
            <p className={styles.noPlatform}>
              Платформа не выбрана. Выберите ваше оружие — и каталог подскажет, какие изделия вам
              подходят.
            </p>
          )}

          <WeaponSelector
            platforms={platforms}
            selectedPlatformId={profile?.selected_platform_id ?? null}
          />
        </section>

        {/* ── Logout ── */}
        <div className={styles.logoutSection}>
          <form action={logout}>
            <button type="submit" className={styles.logoutButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Выйти
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
