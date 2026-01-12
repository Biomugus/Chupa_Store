'use client';

import Filters from '../Filters/Filters';
import ProductCard from '../ProductCard/ProductCard';

import { CatalogItem } from '../../types/CatalogItem';

import styles from './catalogList.module.css';
import { CatalogFilters } from '../../types/CatalogFilters';

type CatalogListProps = {
  items: CatalogItem[];
  filters: CatalogFilters;
  onFiltersChange: (filters: Partial<CatalogFilters>) => void;
};

export default function CatalogList({ items, filters, onFiltersChange }: CatalogListProps) {
  return (
    <section>
      <Filters filters={filters} onFiltersChange={onFiltersChange} />
      <div className={styles.list}>
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
