import styles from './hero.module.css';
import Link from 'next/link';

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.label}>Мастерская Чупы</p>
        <h1 className={styles.title}>Оружейные аксессуары</h1>
        <span className={styles.highlight}>Дерево. Качество. Характер.</span>
        <p className={styles.subtitle}>
          Ваша винтовка заслуживает большего, чем пластик. Мы даём ей душу — изготавливаем из дерева
          и фанеры тактические приклады, цевья, рукояти для безупречного вида и чувства контроля.
          Под АК серию на Airsoft и огнестрел (гладкоствольное и нарезное). Под ваш неповторимый
          стиль. Закажите превосходство..
        </p>

        <div className={styles.actions}>
          <Link href="/catalog">
            <button className={styles.primary}>Каталог</button>
          </Link>
          <button className={styles.secondary}>О Мастерской</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
