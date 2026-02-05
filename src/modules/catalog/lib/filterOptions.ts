// src/modules/catalog/lib/filterOptions.ts

export type FilterOption = {
  value: string;
  label: string;
};

export const PLATFORM: FilterOption[] = [
  { value: 'AK', label: 'АК' },
  { value: 'AR', label: 'AR' },
  { value: 'HK', label: 'HK' },
  { value: 'others', label: 'Другие платформы' },
];

export const PRODUCT_TYPE: FilterOption[] = [
  { value: 'handguard', label: 'Цевья' },
  { value: 'stock', label: 'Приклады' },
  { value: 'grip', label: 'Рукоятки' },
  { value: 'mlock', label: 'Mlok-фурнитруа' },
];

export const MATERIALS: FilterOption[] = [
  { value: 'plywood', label: 'Бакелитовая фанера' },
  { value: 'walnut', label: 'Орех' },
];
