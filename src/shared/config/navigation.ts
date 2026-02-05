// src/shared/config/navigation.ts

type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Цевья', href: '/catalog?productType=handguard' },
  { label: 'Рукоятки', href: '/catalog?productType=grip' },
  { label: 'Приклады', href: '/catalog?productType=stock' },
  { label: 'Mlok-комплектующие', href: '/catalog?productType=mlock' },
  { label: 'Кастомные проекты', href: '/customs' },
  { label: 'О Мастерской', href: '/history' },
];

export const BRAND_NAME = 'МАСТЕРСКАЯ ЧУПЫ';
export const HOME_LABEL = 'На главную';
