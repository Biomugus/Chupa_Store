export type FilterOption = {
    value: string;
    label: string;
};

// TODO: значения value сейчас моковые. Синхронизировать с контрактом бэкенда/URL, когда он будет готов.

export const PLATFORM: FilterOption[] = [
    { value: 'AK series', label: 'АК' },
    { value: 'AR series', label: 'AR' },
    { value: 'Hekler & Coch', label: 'HK' },
    { value: 'Others', label: 'Другие платформы' },
];

export const PRODUCT_TYPE: FilterOption[] = [
    { value: 'handguard', label: 'Цевья' },
    { value: 'stock', label: 'Приклады' },
    { value: 'handle', label: 'Рукоятки' },
    { value: 'cut', label: 'Mlok-фурнитруа' },
];

export const MATERIALS: FilterOption[] = [
    { value: 'bakelite', label: 'Бакелитовая фанера' },
    { value: 'oak', label: 'Орех' },
];


