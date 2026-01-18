'use client'

import {
	CheckoutFormUIProps,
	ContactMethod,
	DeliveryService,
	PaymentMethod
} from '../types/checkoutTypes'

import Spinner from '@/shared/ui/spinner/Spinner'
import styles from './checkoutFormUI.module.css'

export function CheckoutFormUI({
	values,
	errors,
	isValid,
	isLoading,
	isRetry,
	submitError,
	onChange,
	onSubmit,
	onRetry,
}: CheckoutFormUIProps) {
	return (
		<form
			className={styles.form}
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit()
			}}
		>
			{/* Location */}
			<div className={styles.field}>
				<label htmlFor='location' className={styles.label}>
					Город
				</label>
				<input
					id='location'
					name='location'
					className={styles.input}
					type="text"
					autoComplete='address-level2'
					value={values.location}
					onChange={(e) => onChange('location', e.target.value)}
				/>
				{errors.location && <p className={styles.error}>{errors.location}</p>}
			</div>

			{/* Surname + name */}
			<div className={styles.field}>
				<label htmlFor='fullName' className={styles.label}>
					ФИО
				</label>
				<input
					id='fullName'
					name='fullName'
					className={styles.input}
					type="text"
					autoComplete='name'
					value={values.fullName}
					onChange={(e) => onChange('fullName', e.target.value)}
				/>
				{errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
			</div>

			{/* tel */}
			<div className={styles.field}>
				<label htmlFor='phone' className={styles.label}>
					Телефон
				</label>
				<input
					id='phone'
					name='phone'
					className={styles.input}
					type="tel"
					autoComplete='tel'
					placeholder="+7XXXXXXXXXX"
					value={values.phone}
					onChange={(e) => onChange('phone', e.target.value)}
				/>
				{errors.phone && <p className={styles.error}>{errors.phone}</p>}
			</div>

			{/* Payment method */}
			<div className={styles.field}>
				<label htmlFor='paymentMethod' className={styles.label}>
					Способ оплаты
				</label>
				<select
					id='paymentMethod'
					name='paymentMethod'
					autoComplete='off'
					className={styles.select}
					value={values.paymentMethod}
					onChange={(e) =>
						onChange('paymentMethod', e.target.value as PaymentMethod)
					}
				>
					<option value={PaymentMethod.CARD_TRANSFER}>
						Перевод на карту
					</option>
					<option value={PaymentMethod.LEGAL_ENTITY}>
						Оплата через юр. лицо
					</option>
				</select>
			</div>

			{/* delivery service */}
			<div className={styles.field}>
				<label htmlFor='deliveryService' className={styles.label}>
					Служба доставки
				</label>
				<select
					id='deliveryService'
					name='deliveryService'
					autoComplete='off'
					className={styles.select}
					value={values.deliveryService}
					onChange={(e) =>
						onChange('deliveryService', e.target.value as DeliveryService)
					}
				>
					<option value={DeliveryService.POST_RUSSIA}>
						Почта России
					</option>
					<option value={DeliveryService.CDEK}>СДЭК</option>
					<option value={DeliveryService.YANDEX}>
						Яндекс Доставка
					</option>
					<option value={DeliveryService.DPD}>DPD</option>
					<option value={DeliveryService.PONY_EXPRESS}>
						Pony Express
					</option>
				</select>
			</div>

			{/* Communication method */}
			<div className={styles.field}>
				<label htmlFor='contactMethod' className={styles.label}>
					Способ связи
				</label>
				<select
					id='contactMethod'
					name='contactMethod'
					autoComplete='off'
					className={styles.select}
					value={values.contactMethod}
					onChange={(e) =>
						onChange('contactMethod', e.target.value as ContactMethod)
					}
				>
					<option value={ContactMethod.TELEGRAM}>Telegram</option>
					<option value={ContactMethod.VK}>VK</option>
				</select>
			</div>

			{/* Contact */}
			<div className={styles.field}>
				<label htmlFor='contactValue' className={styles.label}>
					{values.contactMethod === ContactMethod.VK
						? 'Ссылка на VK'
						: 'Telegram username'}
				</label>
				<input
					id='contactValue'
					name='contactValue'
					className={styles.input}
					type="text"
					autoComplete='username'
					value={values.contactValue}
					onChange={(e) => onChange('contactValue', e.target.value)}
				/>
				{errors.contactValue && <p className={styles.error}>{errors.contactValue}</p>}
			</div>

			{/* Submit Error / Retry */}
			{submitError ? (
				<div className={styles.submitErrorWrapper}>
					<p className={styles.error}>{submitError}</p>
					<button
						className={styles.submitError}
						type="button"
						onClick={onRetry}
						disabled={isLoading}
					>
						{isRetry ? (
							<>
								<span style={{ marginRight: 8 }}>Повторная отправка</span>
								<Spinner size={18} color="#e5484d" />
							</>
						) : (
							'Повторить попытку'
						)}
					</button>
				</div>
			) : (
				<button
					className={styles.submitButton}
					type="submit"
					disabled={!isValid || isLoading}
				>
					{isLoading ? (
						<>
							<span style={{ marginRight: 8 }}>Отправка заказа</span>
							<Spinner size={16} color="#ffffff" />
						</>
					) : (
						'Оформить заказ'
					)}
				</button>
			)}
		</form>
	)
}
