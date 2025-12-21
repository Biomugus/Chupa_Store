import { formatPrice } from '@/shared/lib/formatPrice';

import { CatalogItem } from '../../types/CatalogItem';
import { Product } from '../../types/Product';

import styles from './productCard.module.css'
import Image from 'next/image';

type ProductCardProps = {
  product: CatalogItem | Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.image ?? (product as Product).images?.[0] ?? '/images/placeholder.jpg'

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes='(max-width: 600px) 100vw, 200px'
          loading='lazy'
          decoding='async'
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
        <span className={styles.price}>{formatPrice(product.price)}</span>
      </div>

    </article>
  );
}

