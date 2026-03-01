// src/shared/ui/modal/ModalRoot.tsx

'use client';

import FiltersSidebar from '@/modules/catalog/components/FiltersSidebar/FiltersSidebar';
import Modal from './Modal';
import styles from './Modal.module.css';
import { useModal } from './ModalContext';

export function ModalRoot() {
  const { modal, closeModal } = useModal();

  return (
    <>
      <Modal isOpen={modal.type === 'nav'} onClose={closeModal}>
        <p
          style={{
            padding: '50px 50px',
            color: 'black',
            fontSize: '14px',
            letterSpacing: '1px',
            textAlign: 'center',
          }}
        >
          Раздел ещё на стадии разработки. Пока можете ознакомиться с каталогом :)
        </p>
      </Modal>

      <Modal isOpen={modal.type === 'filters'} onClose={closeModal}>
        <div className={styles.filtersDrawer}>
          <FiltersSidebar />
        </div>
      </Modal>
    </>
  );
}
