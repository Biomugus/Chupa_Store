import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { CatalogItem } from '../types/CatalogItem';

export async function getCatalog(): Promise<CatalogItem[]> {
  return httpClient<CatalogItem[]>(endpoints.catalog);
}

