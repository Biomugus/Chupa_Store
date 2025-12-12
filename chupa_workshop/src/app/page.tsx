import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Hello! This is Chupa Workshop! From Russia - with love.</h1>
        </div>
      </main>
    </div>
  );
}
