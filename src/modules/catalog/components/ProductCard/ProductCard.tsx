// src/modules/catalog/components/ProductCard/ProductCard.tsx

import { formatPrice } from '@/shared/lib/formatPrice';
import { Product } from '../../model/productsSchema';
import { AddToCartButton } from './AddToCartButton';
import DetailsButton from './DetailsButton';
import styles from './productCard.module.css';
import ProductImageGallery from './ProductImageGallery';

export default function ProductCard({ product }: { product: Product }) {
  const images = product.images ?? ['/images/placeholders/placeholder.jpg'];

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <ProductImageGallery images={images} alt={product.title} />
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>{product.title}</h2>
        </div>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actions}>
          <AddToCartButton product={product} />
          <DetailsButton product={product} />
        </div>
      </div>
    </article>
  );
}
