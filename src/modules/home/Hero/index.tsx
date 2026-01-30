import Image from 'next/image';
import Link from 'next/link';
import styles from './hero.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero/hero.avif"
        alt="Тюнинг оружия - Мастерская Чупы"
        fill
        priority
        quality={80}
        className={styles.heroImage}
        sizes="100vw"
      />

      <div className={styles.content}>
        <p className={styles.label}>Мастерская Чупы</p>
        <h1 className={styles.title}>Тюнинг оружия</h1>
        <span className={styles.highlight}>Стиль. Качество. Характер.</span>
        <p className={styles.subtitle}>
          Ведущий производитель аксессуаров из благородных пород древесины для АК и AR плтаформ. Мы
          предлагаем уникальные изделия из живого материала с высочайшей степенью утилитарности:
          приклады, цевья, рукоятки, Mlok-фурнитуру и многое другое. Наш продукт позволяет сделать
          сборку Вашего оружия по настоящему уникальной и выделяющейся за счет использования
          эстетичных материалов и современного дизайна.
        </p>

        <div className={styles.actions}>
          <Link href="/catalog">
            <button className={styles.primary}>Каталог</button>
          </Link>
          <Link href="/history">
            <button className={styles.secondary}>О Мастерской</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
