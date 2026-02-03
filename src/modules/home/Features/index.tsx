import Image from 'next/image';
import styles from './features.module.css';

const features = [
  {
    id: 1,
    title: 'КАЧЕСТВО',
    desc: 'Постоянное улучшение качества продукции за счет внимательного изучения обратной связи от стрелков, военнослужащих и прочих представителей оружейной культуры в России, подбора соответствующих материалов и использования высокоточного оборудования - всё это позволяет нам держать высокую планку',
    imageUrl: '/images/features/features-quality.avif',
  },
  {
    id: 2,
    title: 'ИНДИВИДУАЛЬНОСТЬ',
    desc: 'Для того что бы создавать уникальные, единичные, кастомные изделия - мы используем не только современное оборудование но и сложные техники ручной художественной обработки дерева: резьба декоративных надписей, орнаментов и тд.',

    imageUrl: '/images/features/features-personality.avif',
  },
  {
    id: 3,
    title: 'ОТСЫЛКИ',
    desc: 'Мы любим и активно интересуемся военной историей, вдохновляемся ей в процессе создания дизайна или названий для наших изделий',
    imageUrl: '/images/features/features-history.avif',
  },
  {
    id: 4,
    title: 'ЭСТЕТИКА',
    desc: 'Нас ценят за красоту, возникающую из минимализма, ясной структуры и отсутствия лишнего. Простые формы изделий работают потому, что мозгу не приходится пробираться через визуальный шум. Мы не стремимся создать красоту искуственно - лишь подсвечиваем её для Вас.',
    imageUrl: '/images/features/features-aesthetics.avif',
  },
];

function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.header}>
        <p className={styles.kicker}>Наши преимущества</p>
        <h2 className={styles.title}>За что нас выбирают?</h2>
        <p className={styles.subtitle}>
          Уникальный авторский дизайн изделий с высокой практичностью, экзотическое сочетание
          традиционных материалов с современными элементами оружейного тюнинга – это то, за что
          выбирают наш продукт. Наша общая концепция отсылает к оружейной эстетике периода холодной
          войны, к брутальной милитари культуре второй половины двадцатого века.
        </p>
      </div>

      <div className={styles.rows}>
        {features.map((feature, index) => {
          const isReversed = index % 2 === 1;

          return (
            <article
              key={feature.id}
              className={`${styles.row} ${isReversed ? styles.rowReversed : ''}`}
            >
              <div className={styles.rowImage}>
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.imageElement}
                  quality={80}
                  priority={index === 0}
                />
              </div>
              <div className={styles.rowContent}>
                <h3 className={styles.rowTitle}>{feature.title}</h3>
                <p className={styles.rowDesc}>{feature.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Features;
