// src/modules/catalog/components/Filters/Filters.tsx

'use client';

import styles from './filters.module.css';

import { CatalogFilters } from '../../types/CatalogFilters';

type FiltersProps = {
  filters: CatalogFilters;
  onFiltersChange: (filters: Partial<CatalogFilters>) => void;
};

const LIMIT_OPTIONS = [10, 20, 50] as const;

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const handleLimitChange = (limit: number) => {
    onFiltersChange({ limit });
  };

  return (
    <div className={styles.filters}>
      <span className={styles.label}>Показывать по:</span>
      {LIMIT_OPTIONS.map((limit) => (
        <button
          key={limit}
          type="button"
          className={`${styles.limitButton} ${filters.limit === limit ? styles.active : ''}`}
          onClick={() => handleLimitChange(limit)}
        >
          {limit}
        </button>
      ))}
    </div>
  );
}
