// src/modules/catalog/components/FiltersSidebar/FiltersSidebar.tsx

'use client';

import { useEffect, useState, useTransition } from 'react';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { MATERIALS, PLATFORM, PRODUCT_TYPE } from '../../lib/filterOptions';
import { CatalogSearchParams } from '../../model/productsSchema';
import DropdownFilter from './DropdownFilter';
import styles from './filtersSidebar.module.css';

function FiltersSidebar() {
  const { filters, updateFilters, resetFilters } = useCatalogFilters();

  const [isPending, startTransition] = useTransition();

  const [localFilters, setLocalFilters] = useState<CatalogSearchParams>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key: keyof CatalogSearchParams, value: string | number | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleApply = () => {
    startTransition(() => {
      updateFilters(localFilters);
    });
  };

  return (
    <section className={`${styles.sidebar} ${isPending ? styles.loading : ''}`}>
      <h2 className={styles.title}>Фильтрация</h2>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Платформа"
            options={PLATFORM}
            placeholder="Выберите платформу"
            value={localFilters.model ?? ''}
            onChange={(value) => handleChange('model', value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Тип Изделия"
            options={PRODUCT_TYPE}
            placeholder="Выберите тип изделия"
            value={localFilters.productType ?? ''}
            onChange={(value) => handleChange('productType', value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Материал"
            options={MATERIALS}
            placeholder="Выберите материал"
            value={localFilters.material ?? ''}
            onChange={(value) => handleChange('material', value)}
          />
        </div>

        <div className={styles.priceGroup}>
          <label className={styles.label}>Цена</label>
          <div className={styles.priceInputs}>
            <input
              type="number"
              className={styles.input}
              placeholder="От"
              value={localFilters.minPrice ?? ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              className={styles.input}
              placeholder="До"
              value={localFilters.maxPrice ?? ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.resetButton} onClick={resetFilters}>
            Сбросить
          </button>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            {isPending ? 'Загрузка...' : 'Применить'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FiltersSidebar;
