import Link from 'next/link';
import styles from './cta.module.css';

function Cta() {
  return (
    <section className={styles.cta}>
      <div className={styles.inner}>
        <div className={styles.texts}>
          <h2>Готовы ознакомиться?</h2>
          <p>
            Вы можете перейти в каталог и оформить там заявку на наши изделия. После заполнения
            небольшой формы заявка попадет напрямую нашему менеджеру в тг канал и с Вами свяжутся
            для уточнения деталей.
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/catalog">
            <button className={styles.primary}>Перейти в каталог</button>
          </Link>
          <button className={styles.secondary}>Уточнить детали</button>
        </div>
      </div>
    </section>
  );
}

export default Cta;
