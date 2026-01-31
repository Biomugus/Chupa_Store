// src/modules/catalog/components/ProductCard/ProductCard.tsx

import { Product } from '@/app/api/products/productsShema';
import { formatPrice } from '@/shared/lib/formatPrice';
import { AddToCartButton } from './AddToCartButton';
import styles from './productCard.module.css';
import ProductImageGallery from './ProductImageGallery';

export default function ProductCard({ product }: { product: Product }) {
  const images = product.images ?? ['/images/placeholders/placeholder.jpg'];

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <ProductImageGallery images={images} alt={product.title} />
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.right}>
        <div className={styles.header}>
          <h2 className={styles.title}>{product.title}</h2>
          <h3>
            <strong className={styles.heading}>Описание: </strong>
          </h3>
          <p className={styles.description}>{product.content.description}</p>

          <h3>
            <strong className={styles.heading}>Характеристики: </strong>
          </h3>
          <p className={styles.description}>{product.content.characteristics}</p>

          <h3>
            <strong className={styles.heading}>Совместимость: </strong>
          </h3>
          <p className={styles.description}>{product.content.compatibility}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actions}>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
