'use client'

import styles from './catalogPage.module.css'

import { useCatalogFilters } from '../../hooks/useCatalogFilters'
import CatalogLayout from '../CatalogLayout/CatalogLayout'
import CatalogList from '../CatalogList/CatalogList'
import FiltersSidebar from '../FiltersSidebar/FiltersSidebar'
import CatalogHero from '../QuickFilters/CatalogHero'

// Controller по GRASP - композирует все части, делегирует логику хукам
function CatalogPage() {
  const { items, filters, loading, updateFilters } = useCatalogFilters()

  return (
    <div className={styles.page}>
      {loading ? (
        <div>Подождите, каталог загружается...</div>
      ) : (
        <CatalogLayout
          quickFilters={<CatalogHero />}
          sidebar={<FiltersSidebar filters={filters} onFiltersChange={updateFilters} />}
        >
          <CatalogList items={items} filters={filters} onFiltersChange={updateFilters} />
        </CatalogLayout>
      )}
    </div>
  )
}

export default CatalogPage
