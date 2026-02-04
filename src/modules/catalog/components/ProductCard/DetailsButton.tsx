// src/modules/catalog/components/ProductCard/DetailsButton.tsx

'use client';

import { Product } from '@/app/api/products/productsShema';
import { useModal } from '@/shared/ui/modal/ModalContext';
import styles from './productCard.module.css';

export default function DetailsButton({ product }: { product: Product }) {
  const { openModal } = useModal();

  const handleAdd = () => {
    openModal('product_detail', product);
  };

  return (
    <button type="button" className={styles.addButton} onClick={handleAdd}>
      О товаре
    </button>
  );
}
