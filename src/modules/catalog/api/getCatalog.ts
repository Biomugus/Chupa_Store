// src/modules/catalog/api/getCatalog.ts

import { CompatibilityStatus } from '@/modules/armory/types/armoryTypes';
import { createClient } from '@/shared/api/supabase/server';
import { CatalogSearchParams, Product, mapDbProduct } from '../model/productsSchema';

export async function getProducts(
  params?: CatalogSearchParams,
  userPlatformId?: string | null,
): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase.from('products').select('*');

  if (params?.model) query = query.eq('model', params.model);
  if (params?.productType) query = query.eq('product_type', params.productType);
  if (params?.material) query = query.eq('material', params.material);

  if (params?.minPrice) query = query.gte('price', Number(params.minPrice));
  if (params?.maxPrice) query = query.lte('price', Number(params.maxPrice));

  if (params?.query) {
    query = query.ilike('title', `%${params.query}%`);
  }

  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name_asc':
        query = query.order('title', { ascending: true });
        break;
      case 'name_desc':
        query = query.order('title', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error || !data) return [];

  const products = data.map(mapDbProduct);

  if (!userPlatformId) return products;

  const productIds = products.map((p) => p.id);
  const { data: compatData } = await supabase
    .from('product_compatibility')
    .select('product_id, status')
    .eq('platform_id', userPlatformId)
    .in('product_id', productIds);

  if (!compatData || compatData.length === 0) return products;

  const compatMap = new Map<string, CompatibilityStatus>();
  for (const row of compatData) {
    compatMap.set(row.product_id, row.status);
  }

  return products.map((product) => ({
    ...product,
    compatibilityStatus: compatMap.get(product.id) ?? null,
  }));
}
