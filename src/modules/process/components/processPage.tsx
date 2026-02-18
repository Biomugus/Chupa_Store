import styles from '@/shared/ui/articlePage/articlePage.module.css';
import Image from 'next/image';

function processPage() {
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <div className={styles.header}>
          <h1 className={styles.title}>Процесс работы</h1>

          <p className={styles.lead}>
            От выбора древесины до готового изделия — как мы создаем цевья, приклады и рукоятки.
          </p>
        </div>

        <section className={styles.section}>
          <h2 id="selection">Отбор и подготовка древесины</h2>

          <p>
            Всё начинается с тщательного отбора древесины. Мы выбираем только стабильные и
            качественные породы, подходящие для оружейных деталей. Древесина проходит сушку и
            проверку на дефекты.
          </p>

          <p>На этом этапе закладываются основы долговечности и качества будущего изделия.</p>
        </section>

        <section className={styles.section}>
          <h2 id="cutting">Формирование заготовок</h2>

          <p>
            Заготовки распиливаются и обрабатываются по точным размерам с использованием станков и
            ручных инструментов. Важно сохранить структуру древесины и подготовить детали для
            последующей шлифовки.
          </p>

          <figure className={styles.figure}>
            <Image
              src="/images/process.jpg"
              alt="Формирование заготовок"
              width={600}
              height={200}
            />
            <figcaption>Распил и первичная обработка заготовок</figcaption>
          </figure>
        </section>

        <section className={styles.section} aria-labelledby="shaping">
          <h2 id="shaping">Шлифовка и точная подгонка</h2>

          <p>
            Каждая деталь проходит точную шлифовку и проверку на соответствие форме и эргономике.
            Все поверхности доводятся до идеала, чтобы готовое изделие было удобным и эстетичным.
          </p>

          <blockquote className={styles.blockquote}>
            Тонкая шлифовка превращает заготовку в качественный и долговечный продукт.
          </blockquote>
        </section>

        <section className={styles.section} aria-labelledby="finishing">
          <h2 id="finishing">Отделка и контроль качества</h2>

          <p>
            Цевья, приклады и рукоятки покрываются маслом или лаком, подчеркивающим текстуру
            древесины и обеспечивающим долговечность.
          </p>

          <figure className={styles.figure}>
            <Image src="/images/process2.jpg" alt="Финишная обработка" width={1200} height={800} />
            <figcaption>Финишная отделка деталей</figcaption>
          </figure>

          <p>
            Каждое изделие проходит финальный контроль качества и подготовку к использованию,
            соответствуя высоким стандартам мастерской.
          </p>
        </section>
      </article>
    </main>
  );
}

export default processPage;
