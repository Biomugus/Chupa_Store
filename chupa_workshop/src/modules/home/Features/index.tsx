import styles from './features.module.css';

const features = [
    {
        id: 1,
        title: 'КАЧЕСТВО',
        desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quas quod nam cumque, culpa quidem repellendus ipsum maiores porro vitae autem neque nostrum, impedit nesciunt! Illo vero inventore quo quae!',
        imageUrl: 'https://sun9-15.userapi.com/s/v1/ig2/ff_juk_6FsshvtQnR5jYbl4VgoECrO1piz3NtGnw2AVlib66BZyVXJVsKvv0ONWMEBzfZEIRIV3RbEoHUTfjaVvt.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960&from=bu&cs=1280x0',
    },
    {
        id: 2,
        title: 'КРАСОТА',
        desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quas quod nam cumque, culpa quidem repellendus ipsum maiores porro vitae autem neque nostrum, impedit nesciunt! Illo vero inventore quo quae!',
        imageUrl: '/images/features2.jpg',
    },
    {
        id: 3,
        title: 'ИСТОРИЯ',
        desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quas quod nam cumque, culpa quidem repellendus ipsum maiores porro vitae autem neque nostrum, impedit nesciunt! Illo vero inventore quo quae!',
        imageUrl: 'https://sun9-74.userapi.com/s/v1/ig2/1V9WaFR9QZDlIeYeHCfOgE9SGe60R9HtZbSx1YpLdwYoE3JbLFi2e9CQTMisV49JoW9xBlcZv5R0aZUG36a2kho2.jpg?quality=95&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,720x540,1080x810,1280x960,1440x1080,2560x1920&from=bu&cs=2560x0',
    },
    {
        id: 4,
        title: 'ЭСТЕТИКА',
        desc: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque quas quod nam cumque, culpa quidem repellendus ipsum maiores porro vitae autem neque nostrum, impedit nesciunt! Illo vero inventore quo quae!',
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
                <p className={styles.subtitle}>При покупке приклада , рукоятки или любого другого аксессуара нам важно,
                    что бы Вы понимали и могли по достоинству оценить, как мы работаем - какие материалы
                    используем, чем отличаемся от других и в чём наша уникальность. Для этого ознакомьтесь с разделом ниже</p>
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