import styles from './features.module.css';

const features = [
    { id: 1, title: 'Качество', desc: 'Держит проверку возрастом :D', url: 'https://gunszip.org/images/g/241/orig/5923945.jpg' },
    { id: 2, title: 'Красота', desc: 'работаем даже с музеями', url: 'https://cs12.pikabu.ru/post_img/big/2021/11/06/9/163621193212445206.jpg' },
    { id: 3, title: 'История', desc: 'Используется много лет', url: 'https://topwar.ru/uploads/posts/2012-12/1356729396_pm_md_63_65_90-3.jpg' },
    { id: 4, title: 'Эстетика', desc: 'Ну красиво же', url: 'https://www.airsoftstore.ru/components/com_virtuemart/shop_image/product/_________________522c21de47907.jpg' },
];

function Features() {
    return (
        <section className={styles.features}>
            <div className={styles.header}>
                <p className={styles.kicker}>Наши преимущества</p>
                <h2 className={styles.title}>Особенности работы с нами</h2>
                <p className={styles.subtitle}>Что бы дать Вам больше понимания о том, как мы работаем - ознакомьтесь с этим разделом</p>
            </div>

            <ul className={styles.list}>
                {features.map((f) => (
                    <li key={f.id} className={styles.card}>
                        <strong className={styles.cardTitle}>{f.title}</strong>
                        <p className={styles.cardDesc}>{f.desc}</p>
                        <img className={styles.cardImage} src={f.url} alt="Котики" />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Features;