'use client';

import { useModal } from '@/shared/ui/modal/ModalContext';
import styles from './catalogPage.module.css';

export default function CatalogPageButton() {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal('filters');
  };

  return (
    <button className={styles.mobileFilterBtn} onClick={handleClick}>
      Фильтры
    </button>
  );
}
