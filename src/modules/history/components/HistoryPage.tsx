import styles from '@/shared/ui/articlePage/articlePage.module.css';
import Image from 'next/image';

function HistoryPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.header}>
          <h1 className={styles.title}>История мастерской</h1>

          <p className={styles.lead}>
            Как все начиналось, через какие этапы прошла мастерская и почему сегодня мы работаем
            именно так.
          </p>
        </div>

        <section className={styles.section}>
          <h2 id="origin">Начало пути</h2>

          <p>
            Описание отправной точки. Почему появилась мастерская, в каком контексте, какие проблемы
            или идеи стали причиной начала работы.
          </p>

          <p>Здесь важно показать не результат, а мотивацию и обстоятельства.</p>
        </section>

        <section className={styles.section}>
          <h2 id="formation">Становление</h2>

          <p>Период роста, ошибок, первых заказов, изменения подходов и взглядов на продукт.</p>

          <figure className={styles.figure}>
            <Image
              src="/images/history2.jpg"
              alt="Ранний этап работы"
              width={1200}
              height={800}
              priority={false}
            />
            <figcaption>Один из первых этапов мастерской</figcaption>
          </figure>

          <p>
            Текст, который объясняет, какие выводы были сделаны и как они повлияли на дальнейшее
            развитие.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="philosophy">
          <h2 id="philosophy">Формирование подхода</h2>

          <p>
            Когда и почему сформировались ключевые принципы работы. Что осталось неизменным, а что
            было пересмотрено.
          </p>

          <blockquote className={styles.blockquote}>
            Мы не гнались за объемом. Нам было важнее понять, как делать правильно.
          </blockquote>
        </section>

        <section className={styles.section} aria-labelledby="today">
          <h2 id="today">Мастерская сегодня</h2>

          <p>Текущее состояние. Как прошлый опыт влияет на решения, которые принимаются сейчас.</p>
        </section>
      </article>
    </main>
  );
}

export default HistoryPage;
