// src/modules/catalog/components/FiltersSidebar/FiltersSidebar.tsx

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { MATERIALS, PLATFORM, PRODUCT_TYPE } from '../../lib/filterOptions';
import { CatalogFilters } from '../../types/CatalogFilters';
import DropdownFilter from './DropdownFilter';
import styles from './filtersSidebar.module.css';

function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localFilters, setLocalFilters] = useState<Partial<CatalogFilters>>({
    model: searchParams.get('model') || '',
    productType: searchParams.get('productType') || '',
    material: searchParams.get('material') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  });

  const handleChange = (key: keyof CatalogFilters, value: string | number | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleReset = () => {
    setLocalFilters({});
    router.push('/catalog', { scroll: false });
  };

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <section className={`${styles.sidebar} ${isPending ? styles.loading : ''}`}>
      <h2 className={styles.title}>Фильтрация</h2>

      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Платформа"
            options={PLATFORM}
            placeholder="Выберите платформу"
            aria-label="Выбор платформы"
            value={localFilters.model ?? ''}
            onChange={(value) => handleChange('model', value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Тип Изделия"
            options={PRODUCT_TYPE}
            placeholder="Выберите тип изделия"
            aria-label="Выбор типа изделия"
            value={localFilters.productType ?? ''}
            onChange={(value) => handleChange('productType', value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Материал"
            options={MATERIALS}
            placeholder="Выберите материал"
            aria-label="Выбор материала"
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
              aria-label="Минимальная цена"
              value={localFilters.minPrice ?? ''}
              onChange={(event) =>
                handleChange(
                  'minPrice',
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              className={styles.input}
              placeholder="До"
              aria-label="Максимальная цена"
              value={localFilters.maxPrice ?? ''}
              onChange={(event) =>
                handleChange(
                  'maxPrice',
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            Сбросить
          </button>
          <button type="button" className={styles.applyButton} onClick={handleApply}>
            Применить
          </button>
        </div>
      </form>
    </section>
  );
}

export default FiltersSidebar;
