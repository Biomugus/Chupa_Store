// src/modules/catalog/lib/translateProductField.ts

/**
 * Словарь для перевода значений полей товара из БД (английских)
 * в русские подписи для UI.
 *
 * Данные берём из тех же filterOptions, чтобы был единый источник правды.
 * Если значение не найдено — возвращаем оригинал (fallback на английскую строку).
 */

import { MATERIALS, PLATFORM, PRODUCT_TYPE } from './filterOptions';

const lookup: Record<string, string> = {};

for (const list of [PLATFORM, PRODUCT_TYPE, MATERIALS]) {
  for (const { value, label } of list) {
    lookup[value.toLowerCase()] = label;
  }
}

/**
 * Переводит значение поля товара в русский текст.
 * @example translateProductField('handguard') → 'Цевья'
 * @example translateProductField('walnut')    → 'Орех'
 * @example translateProductField('AK')        → 'АК'
 */
export function translateProductField(value: string): string {
  return lookup[value.toLowerCase()] ?? value;
}
