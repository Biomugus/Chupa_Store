// src/modules/catalog/components/ProductDetailPage/ProductDetailPage.tsx

import { formatPrice } from '@/shared/lib/formatPrice';
import Link from 'next/link';
import { translateProductField } from '../../lib/translateProductField';
import { Product } from '../../model/productsSchema';
import { AddToCartButton } from '../ProductCard/AddToCartButton';
import { CompatibilityBadge } from '../ProductCard/CompatibilityBadge';
import ProductImageGallery from '../ProductCard/ProductImageGallery';
import styles from './productDetailPage.module.css';

interface ProductDetailPageProps {
  product: Product;
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  const images = product.images?.length ? product.images : ['/images/placeholders/placeholder.jpg'];

  const breadcrumbLabel = product.productType
    ? translateProductField(product.productType)
    : 'Каталог';

  return (
    <article className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Навигация">
        <Link href="/catalog" className={styles.breadcrumbLink}>
          Каталог
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden>
          /
        </span>
        <span className={styles.breadcrumbCurrent}>{breadcrumbLabel}</span>
        <span className={styles.breadcrumbSep} aria-hidden>
          /
        </span>
        <span className={styles.breadcrumbCurrent}>{product.title}</span>
      </nav>

      <div className={styles.grid}>
        <section className={styles.gallerySection}>
          <ProductImageGallery images={images} alt={product.title} />
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoHeader}>
            <h1 className={styles.title}>{product.title}</h1>

            {product.compatibilityStatus && (
              <CompatibilityBadge status={product.compatibilityStatus} />
            )}
          </div>

          <div className={styles.priceLine}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
          </div>

          <div className={styles.metaBadges}>
            {product.model && (
              <span className={styles.badge}>
                <span className={styles.badgeLabel}>Модель</span>
                <span className={styles.badgeValue}>{translateProductField(product.model)}</span>
              </span>
            )}
            {product.material && (
              <span className={styles.badge}>
                <span className={styles.badgeLabel}>Материал</span>
                <span className={styles.badgeValue}>{translateProductField(product.material)}</span>
              </span>
            )}
            {product.productType && (
              <span className={styles.badge}>
                <span className={styles.badgeLabel}>Тип</span>
                <span className={styles.badgeValue}>
                  {translateProductField(product.productType)}
                </span>
              </span>
            )}
          </div>

          <div className={styles.actions}>
            <AddToCartButton product={product} />
          </div>
        </section>
      </div>

      <div className={styles.details}>
        {product.description && (
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>О товаре</h2>
            <div className={styles.sectionDivider} />
            <p className={styles.sectionText}>{product.description}</p>
          </section>
        )}

        {product.characteristics && (
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>Характеристики</h2>
            <div className={styles.sectionDivider} />
            <p className={styles.sectionText}>{product.characteristics}</p>
          </section>
        )}

        {product.compatibility && (
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>Совместимость</h2>
            <div className={styles.sectionDivider} />
            <p className={styles.sectionText}>{product.compatibility}</p>
          </section>
        )}
      </div>

      <div className={styles.backRow}>
        <Link href="/catalog" className={styles.backLink}>
          ← Вернуться в каталог
        </Link>
      </div>
    </article>
  );
}
