'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CatalogFilters } from '../types/CatalogFilters';
import { filterProducts } from '../lib/filterProducts';
import { useCatalog } from './useCatalog';

// Information Expert - знает как работать с фильтрами и каталогом (По GRASP)
export function useCatalogFilters() {
    const { items, loading } = useCatalog();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Парсинг из URL (Single Source of Truth)
    const filters = useMemo<CatalogFilters>(() => {
        const params = new URLSearchParams(searchParams);
        return {
            query: params.get('q') || undefined,
            category: params.get('category') || undefined,
            minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
            maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
            sortBy: (params.get('sortBy') as CatalogFilters['sortBy']) || undefined,
            model: params.get('model') || undefined,
            productType: params.get('productType') || undefined,
            material: params.get('material') || undefined,
            limit: params.get('limit') ? Number(params.get('limit')) : undefined,
        };
    }, [searchParams]);

    // Применение фильтров и лимита
    const filteredItems = useMemo(
        () => {
            const filtered = filterProducts(items, filters);
            return filters.limit ? filtered.slice(0, filters.limit) : filtered;
        },
        [items, filters]
    );

    // Обновление URL (не меняет состояние напрямую)
    const updateFilters = (newFilters: Partial<CatalogFilters>) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`/catalog?${params.toString()}`, { scroll: false });
    };

    return {
        items: filteredItems,
        filters,
        loading,
        updateFilters,
    };
}