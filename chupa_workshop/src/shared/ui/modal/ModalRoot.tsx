'use client';

import { CartModalContainer } from '@/modules/cart/containers/CartModalContainer';
import Modal from './Modal';
import { useModal } from './ModalContext';

export function ModalRoot() {
  const { modal, closeModal } = useModal();

  return (
    <>
      <CartModalContainer />

      <Modal isOpen={modal.type === 'nav'} onClose={closeModal}>
        <p
          style={{
            padding: '24px 32px',
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
