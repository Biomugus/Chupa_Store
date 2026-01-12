import styles from './features.module.css';

const features = [
  {
    id: 1,
    title: 'КАЧЕСТВО',
    desc: 'Постоянное улучшение качества продукции за счет внимательного изучения обратной связи от стрелков, военнослужащих и прочих представителей оружейной культуры в России, подбора соответствующих материалов и использования высокоточного оборудования - всё это позволяет нам держать высокую планку',
    imageUrl:
      'https://sun9-15.userapi.com/s/v1/ig2/ff_juk_6FsshvtQnR5jYbl4VgoECrO1piz3NtGnw2AVlib66BZyVXJVsKvv0ONWMEBzfZEIRIV3RbEoHUTfjaVvt.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
  },
  {
    id: 2,
    title: 'ИНДИВИДУАЛЬНОСТЬ',
    desc: 'Для того что бы создавать уникальные, единичные, кастомные изделия - мы используем не только современное оборудование но и сложные техники ручной художественной обработки дерева: резьба декоративных надписей, орнаментов и тд.',

    imageUrl: '/images/features2.jpg',
  },
  {
    id: 3,
    title: 'ОТСЫЛКИ К ВОЕННОЙ ИСТОРИИ',
    desc: 'Мы любим и активно интересуемся военной историей, вдохновляемся ей в процессе создания дизайна или названий для наших изделий',
    imageUrl:
      'https://sun9-74.userapi.com/s/v1/ig2/1V9WaFR9QZDlIeYeHCfOgE9SGe60R9HtZbSx1YpLdwYoE3JbLFi2e9CQTMisV49JoW9xBlcZv5R0aZUG36a2kho2.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960,1440x1080,2560x1920&from=bu&cs=2560x0',
  },
  {
    id: 4,
    title: 'ЭСТЕТИКА',
    desc: 'Нас ценят за красоту, возникающую из минимализма, ясной структуры и отсутствия лишнего. Простые формы изделий работают потому, что мозгу не приходится пробираться через визуальный шум. Мы не стремимся создать красоту искуственно - лишь подсвечиваем её для Вас.',
    imageUrl:
      'https://sun9-57.userapi.com/s/v1/ig2/oKitGk8IAQcvqVm4fzBY0mTaur6RLNoLXdsfHjwNGaUpqAgO50dGhZdlsBdvHhy2d9AG7Oc518IDO3tfz9QMa6Ty.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x480,480x640,540x720,640x854,720x960,1080x1441,1280x1708,1440x1921,1919x2560&from=bu&u=O2QBwplhQVvr3I23F6CRg-0L9ED3PFARQhscVq9xuAE&cs=1080x0',
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
                <img src={feature.imageUrl} alt={feature.title} />
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
