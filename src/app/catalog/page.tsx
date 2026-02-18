// src/app/catalog/page.tsx

import { getProducts } from '@/modules/catalog/api/getCatalog';
import CatalogPage from '@/modules/catalog/components/CatalogPage/CatalogPage';
import { CatalogSearchParams } from '@/modules/catalog/model/productsSchema';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return <CatalogPage initialItems={products} />;
}
