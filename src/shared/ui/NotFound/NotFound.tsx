// src/app/not-found.tsx

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import btnStyles from '../buttons/buttons.module.css';
import styles from './notFound.module.css';

export default function notFound() {
  return (
    <main className={styles.container}>
      <div className={styles.bgWrapper}>
        <Image
          src={'/images/not-found/background.jpeg'}
          alt="Фон мастерской"
          quality={80}
          fill
          priority
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Раздел в разработке</h1>
        <h3 className={styles.subTitle}>Приносим свои извинения :)</h3>
        <p className={styles.text}>
          Мы активно работаем над этой страницей. Скоро здесь появится вся необходимая для Вас
          информация.
        </p>

        <div className={styles.buttonsWrapper}>
          <Link href="/">
            <Button className={`${btnStyles.btnBrand} ${styles.addButton}`}>
              Вернуться на главную
            </Button>
          </Link>
          <Link href="/catalog">
            <Button className={`${btnStyles.btnBrand} ${styles.addButton}`}>
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
