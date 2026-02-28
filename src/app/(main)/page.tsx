import Cta from '@/modules/home/Cta';
import Features from '@/modules/home/Features';
import Hero from '@/modules/home/Hero';
import styles from './page.module.css';

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
