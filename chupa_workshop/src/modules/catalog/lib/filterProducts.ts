// modules/catalog/lib/filterProducts.ts
import { CatalogItem } from '../types/CatalogItem';
import { CatalogFilters } from '../types/CatalogFilters';

// Pure function - легко тестировать, переиспользовать
export function filterProducts(products: CatalogItem[], filters: CatalogFilters): CatalogItem[] {
  let filtered = [...products];

  // Поиск по query - ищем в title (case-insensitive)
  if (filters.query) {
    const queryLower = filters.query.toLowerCase();
    filtered = filtered.filter((item) => item.title.toLowerCase().includes(queryLower));
  }

  // Фильтрация по цене
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((item) => item.price <= filters.maxPrice!);
  }

  // Сортировка
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }

  return filtered;
}
