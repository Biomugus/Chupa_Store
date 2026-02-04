// src/shared/ui/modal/ModalContext.tsx

'use client';

import { ModalState, ModalType } from '@/shared/types/modal.types';
import { createContext, useContext, useState } from 'react';

interface ModalContextValue {
  modal: ModalState;
  openModal: <T = unknown>(type: ModalType, payload?: T) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: null });

  const openModal = <T,>(type: ModalType, payload?: T) => {
    setModal({ type, payload });
  };

  const closeModal = () => {
    setModal({ type: null });
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return ctx;
}
