import { observer } from 'mobx-react-lite'
import { useCart } from '../hooks/useCart'
import CartPageUI from '../ui/CartPageUI'

export const CartPageContainer = observer(() => {
	const { items, total, loading, removeItem } = useCart()

	return (
		<CartPageUI
			items={items}
			total={total}
			loading={loading}
			onRemoveItem={removeItem}
		/>
	)
})
