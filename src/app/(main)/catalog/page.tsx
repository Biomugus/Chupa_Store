// src/app/catalog/page.tsx

import { getUserProfile } from '@/modules/armory/api/getUserProfile';
import { getProducts } from '@/modules/catalog/api/getCatalog';
import CatalogPage from '@/modules/catalog/components/CatalogPage/CatalogPage';
import { CatalogSearchParams } from '@/modules/catalog/model/productsSchema';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const profile = await getUserProfile();

  const products = await getProducts(params, profile?.selected_platform_id);

  return <CatalogPage initialItems={products} />;
}
