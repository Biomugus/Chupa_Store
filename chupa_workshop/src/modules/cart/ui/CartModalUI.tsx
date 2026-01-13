'use client'

import Modal from '@/shared/ui/modal/Modal'
import Image from 'next/image'
import style from './cartModal.module.css'

import { CartModalUIProps } from '../types/CartModalUIProps'

export default function CartModalUI({ isOpen, onClose, items, total, loading, onRemoveItem }: CartModalUIProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen onClose={onClose}>
      <button
        className={style.closeButton}
        onClick={onClose}
        aria-label='Закрыть корзину'
      >
        x
      </button>

      {loading && <p className={style.loadingMessage}>Загрузка…</p>}

      {!loading && items.length === 0 && <p className={style.emptyMessage}>Корзина пуста</p>}

      {!loading &&
        items.map((item) => (
          <div key={item.id} className={style.cartItem}>
            <Image
              src={item.image}
              alt={item.title}
              width={48}
              height={48}
            />
            <div className={style.cartItemDetails}>
              <span className="title">{item.title}</span>
              <span className="price">{item.price} ₽</span>
            </div>
            <button onClick={() => onRemoveItem(item.id)}>Удалить</button>
          </div>
        ))}

      <hr />
      <strong className={style.total}>Итого: {total} ₽</strong>
    </Modal>
  )
}
