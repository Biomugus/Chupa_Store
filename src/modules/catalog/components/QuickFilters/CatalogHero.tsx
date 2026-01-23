import styles from './catalogHero.module.css';

function CatalogHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h3 className={styles.heroTitle}>Добро пожаловать в каталог!</h3>
        <p className={styles.heroDescription}>
          Всё необходимое для вашего АК в одном каталоге. От проверенных временем классических
          решений до современных тактических улучшений — у нас есть аксессуары для любых задач.
          Качество, надёжность и внимание к деталям в каждом изделии.
        </p>
      </div>
    </div>
  );
}

export default CatalogHero;
