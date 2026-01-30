import Image from 'next/image';
import styles from './catalogHero.module.css';

function CatalogHero() {
  return (
    <div className={styles.hero}>
      <Image
        src="/images/catalog/catalogPreview.avif"
        alt="Фон превью каталога"
        fill
        priority
        fetchPriority="high"
        quality={80}
        className={styles.heroImage}
      />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          <strong className={styles.highlight}>Тюнинг АК</strong>
        </h1>
        <p className={styles.heroDescription}>
          Всё необходимое в одном каталоге. От проверенных временем классических решений до
          современных тактических улучшений — у нас есть аксессуары для любых задач. Качество,
          надёжность и внимание к деталям в каждом изделии.
        </p>
      </div>
    </div>
  );
}

export default CatalogHero;
