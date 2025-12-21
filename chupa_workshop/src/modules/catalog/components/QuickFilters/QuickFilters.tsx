import styles from './quickFilters.module.css'
import { CatalogFilters } from '../../types/CatalogFilters';
import { useState } from 'react';

type QuickFiltersProps = {
    filters: CatalogFilters;
    onFiltersChange: (filters: Partial<CatalogFilters>) => void;
}

// Моковые данные для фильтров
const AK_MODELS = [
    { value: '', label: 'Все модели' },
    { value: 'airsoft', label: 'Страйкбольный' },
    { value: 'firearm', label: 'Огнестрел' },
    { value: 'carbine', label: 'Карабин на базе АК' },
];

const PRODUCT_TYPES = [
    { value: '', label: 'Все изделия' },
    { value: 'handguard', label: 'Цевье' },
    { value: 'stock', label: 'Приклад' },
    { value: 'grips', label: 'Накладки' },
    { value: 'handle', label: 'Рукоять' },
    { value: 'cut', label: 'Перепилы' },
];

const MATERIALS = [
    { value: '', label: 'Все материалы' },
    { value: 'bakelite', label: 'Бакелит' },
    { value: 'oak', label: 'Дуб' },
    { value: 'birch', label: 'Береза' },
    { value: 'walnut', label: 'Орех' },
];

function QuickFilters({ filters, onFiltersChange }: QuickFiltersProps) {
    const [localFilters, setLocalFilters] = useState<Partial<CatalogFilters>>({
        model: filters.model || '',
        productType: filters.productType || '',
        material: filters.material || '',
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
    });

    const handleChange = (key: keyof CatalogFilters, value: string | number | undefined) => {
        setLocalFilters(prev => ({ ...prev, [key]: value || undefined }));
    };

    const handleReset = () => {
        const resetFilters = {
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
        <div className={styles.filters}>
            <div className={styles.preview}>
                <h3>Добро пожаловать в каталог!</h3>
                <p>Всё необходимое для вашего АК в одном каталоге.
                    От проверенных временем классических решений до современных тактических улучшений —
                    у нас есть аксессуары для любых задач. Качество, надёжность и внимание к деталям в каждом изделии.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Модель АК</label>
                    <select
                        className={styles.select}
                        value={localFilters.model || ''}
                        onChange={(e) => handleChange('model', e.target.value)}
                    >
                        {AK_MODELS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.label}>Изделие</label>
                    <select
                        className={styles.select}
                        value={localFilters.productType || ''}
                        onChange={(e) => handleChange('productType', e.target.value)}
                    >
                        {PRODUCT_TYPES.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.label}>Материал</label>
                    <select
                        className={styles.select}
                        value={localFilters.material || ''}
                        onChange={(e) => handleChange('material', e.target.value)}
                    >
                        {MATERIALS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.priceGroup}>
                    <label className={styles.label}>Цена</label>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="От"
                            value={localFilters.minPrice || ''}
                            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <span className={styles.priceSeparator}>—</span>
                        <input
                            type="number"
                            className={styles.input}
                            placeholder="До"
                            value={localFilters.maxPrice || ''}
                            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                        />
                    </div>
                </div>

                <button className={styles.resetButton} onClick={handleReset}>
                    Сбросить
                </button>
                <button className={styles.applyButton} onClick={handleApply}>
                    Применить
                </button>
            </div>
        </div>
    )
}

export default QuickFilters