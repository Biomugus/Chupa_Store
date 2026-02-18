// src/modules/catalog/components/ProductCard/DetailsButton.tsx

'use client';

import { useModal } from '@/shared/ui/modal/ModalContext';
import btnStyles from '../../../../shared/ui/buttons/buttons.module.css';
import { Product } from '../../model/productsSchema';
import styles from './productCard.module.css';

export default function DetailsButton({ product }: { product: Product }) {
  const { openModal } = useModal();

  const handleAdd = () => {
    openModal('product_detail', product);
  };

  return (
    <button
      type="button"
      className={`${btnStyles.btnBrand} ${styles.addButton}`}
      onClick={handleAdd}
    >
      О товаре
    </button>
  );
}
