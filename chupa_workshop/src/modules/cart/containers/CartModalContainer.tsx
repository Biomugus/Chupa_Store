'use client'

import { useModal } from '@/shared/ui/modal/ModalContext'
import { observer } from 'mobx-react-lite'
import { useCart } from '../hooks/useCart'
import CartModalUI from '../ui/CartModalUI'

export const CartModalContainer = observer(() => {
	const { modal, closeModal } = useModal()
	const { items, total, loading, removeItem } = useCart()

	return (
		<CartModalUI
			isOpen={modal.type === 'cart'}
			onClose={closeModal}
			items={items}
			total={total}
			loading={loading}
			onRemoveItem={removeItem}
		/>
	)
})
