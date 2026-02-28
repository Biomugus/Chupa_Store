// src/modules/catalog/components/ProductCard/AddToCartButton.tsx

'use client';

import { useCart } from '@/modules/cart';
import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import { Product } from '../../model/productsSchema';
import styles from './productCard.module.css';

export const AddToCartButton = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '/images/placeholders/placeholder.jpg',
    });
  };

  return (
    <button
      type="button"
      className={`${btnStyles.btnBrand} ${styles.addButton}`}
      onClick={handleAdd}
    >
      В корзину
    </button>
  );
};
