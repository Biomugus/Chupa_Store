'use client'

import Modal from '@/shared/ui/modal/Modal'
import { CartModalUIProps } from '../types/CartModalUIProps'
import style from './cartModal.module.css'

export function CartModalUi({ isOpen, onClose, children }: CartModalUIProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen onClose={onClose}>
      <button
        className={style.closeButton}
        onClick={onClose}
        aria-label='Закрыть'
      >
        ×
      </button>

      {children}
    </Modal>
  )
}
