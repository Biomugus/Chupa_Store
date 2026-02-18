import styles from '@/shared/ui/articlePage/articlePage.module.css';
import Image from 'next/image';

function missionPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.header}>
          <h1 className={styles.title}>Наша миссия</h1>

          <p className={styles.lead}>
            Что мы создаем, зачем мы это делаем и какие ценности лежат в основе нашей мастерской.
          </p>
        </div>

        <section className={styles.section}>
          <h2 id="purpose">Цель мастерской</h2>

          <p>
            Мы стремимся создавать изделия из дерева, которые не только служат долго, но и радуют
            глаз. Каждый предмет задуман как функциональное искусство, отражающее гармонию природы и
            мастерства.
          </p>

          <p>
            Важно показать, что наша работа имеет смысл не только в результате, но и в процессе
            создания.
          </p>
        </section>

        <section className={styles.section}>
          <h2 id="values">Наши ценности</h2>

          <p>
            Честность в материалах, внимание к деталям, уважение к дереву и экологичная работа — это
            то, что мы соблюдаем в каждом проекте.
          </p>

          <figure className={styles.figure}>
            <Image
              src="/images/mission.jpg"
              alt="Процесс работы в мастерской"
              width={1200}
              height={800}
              priority={false}
            />
            <figcaption>Работа с натуральным деревом требует терпения и точности</figcaption>
          </figure>

          <p>
            Эти принципы помогают нам сохранять высокое качество и создавать изделия, которыми можно
            гордиться.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="approach">
          <h2 id="approach">Подход к работе</h2>

          <p>
            Мы ценим баланс между традиционными техниками обработки дерева и современным дизайном.
            Каждое изделие уникально, и мы внимательно относимся к каждой детали.
          </p>

          <blockquote className={styles.blockquote}>
            Каждое дерево заслуживает уважения, каждая работа — внимания мастера.
          </blockquote>
        </section>

        <section className={styles.section} aria-labelledby="impact">
          <h2 id="impact">Наше влияние</h2>

          <p>
            Через качество изделий и честный подход к процессу мы хотим вдохновлять людей ценить
            ремесло, природу и долговечность вещей.
          </p>
        </section>
      </article>
    </main>
  );
}

export default missionPage;
