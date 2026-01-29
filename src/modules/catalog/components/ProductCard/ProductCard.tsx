// src/modules/catalog/components/ProductCard/ProductCard.tsx

import { formatPrice } from '@/shared/lib/formatPrice';

import { CatalogItem } from '../../types/CatalogItem';
import { Product } from '../../types/Product';

import styles from './productCard.module.css';
import ProductImageGallery from './ProductImageGallery';

import { useCart } from '@/modules/cart/hooks/useCart';
import { observer } from 'mobx-react-lite';

type ProductCardProps = {
  product: CatalogItem | Product;
};

const ProductCard = observer(({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const images =
    (product as Product).images ??
    (product as CatalogItem).images ??
    (product.image ? [product.image] : ['/images/placeholders/placeholder.jpg']);

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      characteristics: product.characteristics,
      image: product.images?.[0] || '/images/placeholders/placeholder.jpg',
    });
  };

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
          <p className={styles.description}>{product.equipment}</p>
          <p className={styles.description}>{product.characteristics}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.addButton} onClick={handleAdd}>
            В корзину
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
