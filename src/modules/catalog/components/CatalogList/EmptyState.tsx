'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import styles from './catalogList.module.css';

export default function EmptyState() {
  const router = useRouter();

  const handleReset = () => {
    router.replace('/catalog', { scroll: false });
  };

  return (
    <div className={styles.emptyContainer}>
      <h3 className={styles.emptyTitle}>Товары не найдены</h3>
      <p className={styles.emptyText}>
        К сожалению, по вашему запросу ничего не нашлось. Попробуйте изменить параметры фильтрации
        или сбросьте их, чтобы увидеть весь ассортимент.
      </p>
      <Button className={styles.resetButton} onClick={handleReset}>
        Сбросить фильтры
      </Button>
    </div>
  );
}
