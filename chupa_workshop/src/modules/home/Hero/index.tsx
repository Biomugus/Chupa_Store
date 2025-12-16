import styles from './hero.module.css';

function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <p className={styles.label}>Мастерская Чупы</p>
                <h1 className={styles.title}>Hero placeholder</h1>
                <p className={styles.subtitle}>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Reprehenderit neque corrupti ipsam iusto facere tempora,
                    nobis officia rem culpa officiis vero exercitationem ut iste saepe quod corporis
                    accusamus suscipit perferendis.</p>

                <div className={styles.actions}>
                    <button className={styles.primary}>Начать</button>
                    <button className={styles.secondary}>Узнать больше</button>
                </div>
            </div>
        </section>
    );
}

export default Hero;