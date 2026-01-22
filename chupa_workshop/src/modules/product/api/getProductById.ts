import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { Product } from '../types/Product';

export async function getProductById(id: string): Promise<Product> {
  return httpClient<Product>(endpoints.catalog.product(id));
}
