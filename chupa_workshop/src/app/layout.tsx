import Footer from '@/shared/ui/Footer';
import Header from '@/shared/ui/Header';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { ModalRoot } from '@/shared/ui/ModalRoot';
import { ModalProvider } from '@/shared/ui/ModalContext';

export const metadata: Metadata = {
  title: 'Мастерская Чупы',
  description:
    'Мастерская Чупы — лучшие кастомные изделия из дерева для страйкбольных приводов АК от Cyma, E&L и LCT. Приклады, цевья, пистолетные рукоятки, уникальная резьба и перепилы магазинов. Ручная работа, высокое качество, доставка по СНГ.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <ModalProvider>
          <Header />
          {children}
          <ModalRoot />
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
