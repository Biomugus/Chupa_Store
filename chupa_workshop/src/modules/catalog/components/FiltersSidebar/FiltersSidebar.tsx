import styles from './filtersSidebar.module.css';
import { CatalogFilters } from '../../types/CatalogFilters';
import { useState } from 'react';
import { PLATFORM, MATERIALS, PRODUCT_TYPE } from '../../lib/filterOptions';
import DropdownFilter from './DropdownFilter';

type FiltersSidebarProps = {
  filters: CatalogFilters;
  onFiltersChange: (filters: Partial<CatalogFilters>) => void;
};

function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [localFilters, setLocalFilters] = useState<Partial<CatalogFilters>>({
    model: filters.model || '',
    productType: filters.productType || '',
    material: filters.material || '',
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  const handleChange = (key: keyof CatalogFilters, value: string | number | undefined) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleReset = () => {
    const resetFilters: Partial<CatalogFilters> = {
      model: undefined,
      productType: undefined,
      material: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    };

    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  return (
    <section className={styles.sidebar}>
      <h2 className={styles.title}>Фильтрация</h2>

      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Платформа"
            options={PLATFORM}
            placeholder="Выберите платформу"
            value={localFilters.model ?? ''}
            onChange={(value) => handleChange('model', value ?? '')}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Тип Изделия"
            options={PRODUCT_TYPE}
            placeholder="Выберите тип изделия"
            value={localFilters.productType ?? ''}
            onChange={(value) => handleChange('productType', value ?? '')}
          />
        </div>

        <div className={styles.filterGroup}>
          <DropdownFilter
            label="Материал"
            options={MATERIALS}
            placeholder="Выберите материал"
            value={localFilters.material ?? ''}
            onChange={(value) => handleChange('material', value ?? '')}
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
              onChange={(event) =>
                handleChange(
                  'minPrice',
                  event.target.value ? Number(event.target.value) : undefined
                )
              }
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              className={styles.input}
              placeholder="До"
              value={localFilters.maxPrice ?? ''}
              onChange={(event) =>
                handleChange(
                  'maxPrice',
                  event.target.value ? Number(event.target.value) : undefined
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
