import Hero from '@/modules/home/Hero';
import styles from './page.module.css';
import Features from '@/modules/home/Features';
import Cta from '@/modules/home/Cta';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <Features />
        <Cta />
      </main>
    </div>
  );
}
