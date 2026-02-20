// src/app/account/page.tsx

import { createClient } from '@/shared/api/supabase/server';
import { redirect } from 'next/navigation';
import styles from './account.module.css';

export const metadata = {
  title: 'Мой аккаунт — Мастерская Чупы',
};

/**
 * Account page (placeholder).
 * Protected by middleware — only accessible to authenticated users.
 * Full implementation will come in Task 3.1 (Dashboard UI).
 */
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <main className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Мой аккаунт</h1>
        <div className={styles.info}>
          <div className={styles.avatar}>{user.email?.charAt(0).toUpperCase()}</div>
          <div>
            <p className={styles.email}>{user.email}</p>
            <p className={styles.hint}>Полный личный кабинет появится в следующем обновлении</p>
          </div>
        </div>
      </div>
    </main>
  );
}
