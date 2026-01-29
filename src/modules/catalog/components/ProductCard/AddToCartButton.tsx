// src/modules/catalog/components/ProductCard/AddToCartButton.tsx

'use client';

import { Product } from '@/app/api/products/productsShema';
import { useCart } from '@/modules/cart/hooks/useCart';
import { observer } from 'mobx-react-lite';
import styles from './productCard.module.css';

export const AddToCartButton = observer(({ product }: { product: Product }) => {
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
    <button type="button" className={styles.addButton} onClick={handleAdd}>
      В корзину
    </button>
  );
});
