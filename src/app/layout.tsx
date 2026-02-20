// src/app/layout.tsx

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ibmPlex, inter, montserrat } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Мастерская Чупы',
  description:
    'Мастерская Чупы — лучшие кастомные изделия из дерева для страйкбольных приводов АК от Cyma, E&L и LCT. Приклады, цевья, пистолетные рукоятки, уникальная резьба и перепилы магазинов. Ручная работа, высокое качество, доставка по СНГ.',
};

/**
 * Root layout: minimal shell shared by ALL routes.
 * Only provides html/body with fonts and global styles.
 * Header/Footer live in (main)/layout.tsx, not here.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${inter.variable} ${ibmPlex.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
