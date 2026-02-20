// src/app/(main)/layout.tsx

import Footer from '@/shared/ui/footer/Footer';
import Header from '@/shared/ui/header/Header';
import { ModalProvider } from '@/shared/ui/modal/ModalContext';
import { ModalRoot } from '@/shared/ui/modal/ModalRoot';
import type { ReactNode } from 'react';

/**
 * Main layout: wraps all public/protected pages with Header, Footer, and Modal system.
 * Auth pages use a separate (auth) layout without these elements.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <Header />
      {children}
      <ModalRoot />
      <Footer />
    </ModalProvider>
  );
}
