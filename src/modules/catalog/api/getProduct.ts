import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { Product } from '../types/Product';

export async function getProduct(slug: string): Promise<Product> {
  return httpClient<Product>(`${endpoints.catalog}/${slug}`);
}
