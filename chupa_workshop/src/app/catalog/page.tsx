import { Suspense } from 'react';

import CatalogPage from '@/modules/catalog/components/CatalogPage/CatalogPage';

export default function Page() {
  <Suspense fallback={<div>Идёт загрузка каталога, оижадйте:)</div>}>
    return <CatalogPage />;
  </Suspense>;
}
