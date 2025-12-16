import styles from './cta.module.css';

function Cta() {
    return (
        <section className={styles.cta}>
            <div className={styles.inner}>
                <div className={styles.texts}>
                    <h2>Готовы начать?</h2>
                    <p>Короткий оффер</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.primary}>Оставить заявку</button>
                    <button className={styles.secondary}>Задать вопрос</button>
                </div>
            </div>
        </section>
    );
}

export default Cta;