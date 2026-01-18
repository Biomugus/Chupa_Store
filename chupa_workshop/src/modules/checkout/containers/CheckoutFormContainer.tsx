'use client'

import { useEffect } from 'react'
import { useCheckoutForm } from '../hooks/useCheckoutForm'
import { useSubmitOrder } from '../hooks/useSubmitOrder'
import { CheckoutFormContainerProps } from '../types/checkoutTypes'
import { CheckoutFormUI } from '../ui/CheckoutFormUI'

export default function CheckoutFormContainer({
	cartSnapshot,
	onOpenSuccessModal,
}: CheckoutFormContainerProps) {
	const { values,
		errors,
		isValid,
		handleChange,
		handleSubmit,
		reset } = useCheckoutForm()

	const { submitOrder, retry, status, error, resetStatus } =
		useSubmitOrder(cartSnapshot)

	const isLoading = status === 'loading'
	const submitError = error
	const isRetry = isLoading && error !== null

	useEffect(() => {
		if (status !== 'success') return

		reset()
		onOpenSuccessModal()
		resetStatus()
	}, [onOpenSuccessModal, reset, resetStatus, status])


	return (
		<CheckoutFormUI
			values={values}
			errors={errors}
			isValid={isValid}
			isRetry={isRetry}
			isLoading={isLoading}
			submitError={submitError}
			onChange={handleChange}
			onSubmit={() => handleSubmit(submitOrder)}
			onRetry={retry}
		/>
	)
}