export type FilterOption = {
    value: string;
    label: string;
};

// TODO: значения value сейчас моковые. Синхронизировать с контрактом бэкенда/URL, когда он будет готов.

export const AK_MODELS: FilterOption[] = [
    { value: '', label: 'Все модели' },
    { value: 'airsoft', label: 'Страйкбольный' },
    { value: 'firearm', label: 'Огнестрел' },
    { value: 'carbine', label: 'Карабин на базе АК' },
];

export const PRODUCT_TYPES: FilterOption[] = [
    { value: '', label: 'Все изделия' },
    { value: 'handguard', label: 'Цевье' },
    { value: 'stock', label: 'Приклад' },
    { value: 'grips', label: 'Накладки' },
    { value: 'handle', label: 'Рукоять' },
    { value: 'cut', label: 'Перепилы' },
];

export const MATERIALS: FilterOption[] = [
    { value: '', label: 'Все материалы' },
    { value: 'bakelite', label: 'Бакелит' },
    { value: 'oak', label: 'Дуб' },
    { value: 'birch', label: 'Береза' },
    { value: 'walnut', label: 'Орех' },
];


