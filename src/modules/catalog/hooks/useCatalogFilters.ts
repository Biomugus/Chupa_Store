// src/modules/catalog/hooks/useCatalogFilters.ts

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { CatalogSearchParams } from '../model/productsSchema';

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo<CatalogSearchParams>(() => {
    return {
      query: searchParams.get('query') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      sortBy: (searchParams.get('sortBy') as SortOption) || undefined,
      model: searchParams.get('model') || undefined,
      productType: searchParams.get('productType') || undefined,
      material: searchParams.get('material') || undefined,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (newFilters: Partial<CatalogSearchParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const resetFilters = useCallback(() => {
    router.push('?', { scroll: false });
  }, [router]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
