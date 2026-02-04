'use client';

import Modal from '@/shared/ui/modal/Modal';
import { CartModalUIProps } from '../types/CartModalUIProps';

export function CartModalUi({ isOpen, onClose, children }: CartModalUIProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen onClose={onClose}>
      {children}
    </Modal>
  );
}
