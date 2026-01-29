// src/app/catalog/page.tsx

import { Suspense } from 'react';

import { CatalogSearchParams, getProducts } from '@/modules/catalog/api/getCatalog';
import CatalogPage from '@/modules/catalog/components/CatalogPage/CatalogPage';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <Suspense fallback={<div>Идёт загрузка каталога, ожидайте:)</div>}>
      <CatalogPage initialItems={products} />
    </Suspense>
  );
}
