import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Мастерская Чупы — кастомные деревянные приклады, цевья и рукоятки для АК (Cyma, E&L, LCT) | Airsoft тюнинг',
  description:
    'Мастерская Чупы — лучшие кастомные изделия из дерева для страйкбольных приводов АК от Cyma, E&L и LCT. Приклады, цевья, пистолетные рукоятки, уникальная резьба и перепилы магазинов. Ручная работа, высокое качество, доставка по СНГ.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
