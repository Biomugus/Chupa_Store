// src/modules/catalog/components/CatalogPage/CatalogPage.tsx

import styles from './catalogPage.module.css';

import { Product } from '@/app/api/products/productsShema';
import CatalogLayout from '../CatalogLayout/CatalogLayout';
import CatalogList from '../CatalogList/CatalogList';
import FiltersSidebar from '../FiltersSidebar/FiltersSidebar';
import CatalogHero from '../QuickFilters/CatalogHero';
import CatalogPageButton from './CatalogPageButton';

function CatalogPage({ initialItems }: { initialItems: Product[] }) {
  return (
    <div className={styles.page}>
      <CatalogLayout
        quickFilters={<CatalogHero />}
        sidebar={
          <div className={styles.desktopSidebar}>
            <FiltersSidebar />
          </div>
        }
      >
        <CatalogPageButton />
        <CatalogList items={initialItems} />
      </CatalogLayout>
    </div>
  );
}

export default CatalogPage;
