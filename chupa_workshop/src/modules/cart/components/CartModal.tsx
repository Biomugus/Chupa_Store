'use client'

import Modal from '@/shared/ui/modal/Modal'
import { useModal } from '@/shared/ui/modal/ModalContext'
import { observer } from 'mobx-react-lite'
import { useCart } from '../hooks/useCart'

import Image from 'next/image'
import style from './cartModal.module.css'

export const CartModal = observer(() => {
  const { modal, closeModal } = useModal()
  const { items, total, loading, removeItem } = useCart()

  if (modal.type !== 'cart') return null

  return (
    <Modal isOpen onClose={closeModal}>
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
              {/* <span className="characteristics">{item.characteristics}</span> */}
            </div>
            <button onClick={() => removeItem(item.id)}>Удалить</button>
          </div>
        ))}

      <hr />
      <strong className={style.total}>Итого: {total} ₽</strong>
    </Modal>
  )
})
