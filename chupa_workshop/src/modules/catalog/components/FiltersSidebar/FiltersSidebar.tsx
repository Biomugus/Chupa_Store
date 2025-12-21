import styles from './filtersSidebar.module.css'
import { CatalogFilters } from '../../types/CatalogFilters';

type FiltersSidebarProps = {
    filters: CatalogFilters;
    onFiltersChange: (filters: Partial<CatalogFilters>) => void;
}

function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
    return (
        <div className={styles.sidebar}>
            <h2 className={styles.title}>Боковые фильтры</h2>
        </div>
    )
}

export default FiltersSidebar