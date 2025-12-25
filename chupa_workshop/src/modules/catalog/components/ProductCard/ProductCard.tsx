import { formatPrice } from '@/shared/lib/formatPrice';

import { CatalogItem } from '../../types/CatalogItem';
import { Product } from '../../types/Product';

import styles from './productCard.module.css';
import ProductImageGallery from './ProductImageGallery';

type ProductCardProps = {
  product: CatalogItem | Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const images =
    (product as Product).images ??
    product.images ??
    (product.image ? [product.image] : ['/images/placeholder.jpg']);

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <ProductImageGallery images={images} alt={product.title} />
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.right}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.addButton}>
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
}

