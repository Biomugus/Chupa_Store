// src/modules/catalog/components/CatalogList/CatalogList.tsx

import { Product } from '@/app/api/products/productsShema';
import ProductCard from '../ProductCard/ProductCard';
import styles from './catalogList.module.css';

type CatalogListProps = {
  items: Product[];
};

export default function CatalogList({ items }: CatalogListProps) {
  return (
    <section>
      <div className={styles.list}>
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
