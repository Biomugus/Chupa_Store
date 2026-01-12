'use client';

import Modal from '@/shared/ui/Modal';
import { useModal } from '@/shared/ui/ModalContext';
import { useCart } from '../hooks/useCart';

export function CartModal() {
  const { modal, closeModal } = useModal();
  const { items, total, loading, removeItem } = useCart();

  if (modal.type !== 'cart') return null;

  return (
    <Modal isOpen onClose={closeModal}>
      {loading && <p>Загрузка…</p>}

      {!loading && items.length === 0 && <p>Корзина пуста</p>}

      {!loading &&
        items.map((item) => (
          <div key={item.id}>
            <span>{item.title}</span>
            <button onClick={() => removeItem(item.id)}>Удалить</button>
          </div>
        ))}

      <hr />
      <strong>Итого: {total}</strong>
    </Modal>
  );
}
