import styles from './features.module.css';

const features = [
    { id: 1, title: 'Огорченный котяй', desc: 'наши котики не грустят', url: 'https://www.sostav.ru/images/news/2019/04/01/9iithyjt_md.jpg' },
    { id: 2, title: 'Малыш', desc: 'работаем даже с малышами', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRoAZdIrRGPp-TeJe6bNP5OC9uDBrtiKxs_Q&s' },
    { id: 3, title: 'Братва', desc: 'Всегда создаем компанию)', url: 'https://cs11.pikabu.ru/post_img/2019/02/04/12/1549312329147951618.jpg' },
    { id: 4, title: 'Голубоглазка', desc: 'Красивые питомцы', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfP-Q1puhZEgaZQRXCnz3tMS_Z61v0ttxs8w&s' },
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