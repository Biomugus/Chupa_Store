'use client'

import { CartModal } from '@/modules/cart/components/CartModal';
import { useModal } from './ModalContext';
import Modal from './Modal';

export function ModalRoot() {
  const { modal, closeModal } = useModal()


  return (
    <>
      <CartModal />

      <Modal isOpen={modal.type === 'nav'} onClose={closeModal}>
        <p
          style={{
            margin: 0,
            fontSize: '1.125rem',
            lineHeight: '1.6',
            textAlign: 'center',
          }}
        >
          Раздел ещё на стадии разработки. Пока можете ознакомиться с каталогом :)
        </p>
      </Modal>
    </>
  );
}
