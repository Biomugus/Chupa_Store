export interface CatalogFilters {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
    model?: string; // Модель АК (страйкбольный, огнестрел, карабин на базе АК)
    productType?: string; // Изделие (цевье, приклад, накладки, рукоять, перепилы)
    material?: string; // Материал изделия (бакелит, дуб, береза, орех и тд.)
    limit?: number;
    // ... и тд.
}

export type FilterKey = keyof CatalogFilters;