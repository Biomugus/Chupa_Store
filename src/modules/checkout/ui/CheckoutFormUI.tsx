// src/modules/checkout/ui/CheckoutFormUI.tsx

'use client';

import {
  CheckoutFormUIProps,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../types/checkoutTypes';

import Spinner from '@/shared/ui/spinner/Spinner';
import styles from './checkoutFormUI.module.css';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CityAutocompleteUI } from './CityAutocompleteUI';

const fieldControlClassName = cn(
  'min-w-[300px] w-full bg-white/5 border-white/20 text-[#f0f0f5]',
  'rounded-[10px] focus-visible:ring-white/30 transition-all',
);

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
  cityAutocompleteProps,
}: CheckoutFormUIProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {/* Location */}
      <div className={styles.field}>
        <label htmlFor="location" className={styles.label}>
          Город
        </label>
        <div className="w-full min-w-[300px]">
          <CityAutocompleteUI {...cityAutocompleteProps} />
        </div>
        {errors.location && <p className={styles.error}>{errors.location}</p>}
      </div>

      {/* Surname + name */}
      <div className={styles.field}>
        <label htmlFor="fullName" className={styles.label}>
          ФИО
        </label>
        <Input
          id="fullName"
          className={cn(fieldControlClassName, errors.fullName && 'border-red-500')}
          placeholder="Иванов Иван Иванович"
          value={values.fullName}
          onChange={(e) => {
            const val = e.target.value.replace(/[^а-яА-ЯёЁa-zA-Z\s-]/g, '');
            onChange('fullName', val);
          }}
        />
        {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
      </div>

      {/* tel */}
      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Телефон
        </label>
        <Input
          id="phone"
          type="tel"
          className={cn(fieldControlClassName, errors.phone && 'border-red-500')}
          placeholder="+7 (999) 000-00-00"
          value={values.phone}
          onChange={(e) => onChange('phone', e.target.value)}
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </div>

      {/* Payment method */}
      <div className={styles.field}>
        <label htmlFor="paymentMethod" className={styles.label}>
          Способ оплаты
        </label>
        <Select
          value={values.paymentMethod}
          onValueChange={(val) => onChange('paymentMethod', val as PaymentMethod)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите способ" />
          </SelectTrigger>

          <SelectContent className="bg-[#1a1c1e] border-white/20 text-white">
            <SelectItem value={PaymentMethod.CARD_TRANSFER}>Перевод на карту</SelectItem>
            <SelectItem value={PaymentMethod.LEGAL_ENTITY}>Оплата через юр. лицо</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* delivery service */}
      <div className={styles.field}>
        <label className={styles.label}>Служба доставки</label>
        <Select
          value={values.deliveryService}
          onValueChange={(val) => onChange('deliveryService', val as DeliveryService)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите службу" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1c1e] border-white/20 text-white">
            <SelectItem value={DeliveryService.CDEK}>СДЭК</SelectItem>
            <SelectItem value={DeliveryService.POST_RUSSIA}>Почта России</SelectItem>
            <SelectItem value={DeliveryService.YANDEX}>Яндекс Доставка</SelectItem>
            <SelectItem value={DeliveryService.DPD}>DPD</SelectItem>
            <SelectItem value={DeliveryService.PONY_EXPRESS}>Pony Express</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Communication method */}
      <div className={styles.field}>
        <label className={styles.label}>Способ связи</label>
        <Select
          value={values.contactMethod}
          onValueChange={(val) => onChange('contactMethod', val as ContactMethod)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите способ связи" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1c1e] border-white/20 text-white">
            <SelectItem value={ContactMethod.TELEGRAM}>Telegram</SelectItem>
            <SelectItem value={ContactMethod.VK}>VK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact */}
      <div className={styles.field}>
        <label htmlFor="contactValue" className={styles.label}>
          {values.contactMethod === ContactMethod.VK ? 'Ссылка на VK' : 'Telegram username'}
        </label>
        <Input
          id="contactValue"
          className={cn(fieldControlClassName, errors.contactValue && 'border-red-500')}
          placeholder={values.contactMethod === ContactMethod.VK ? 'vk.com/id...' : '@username'}
          value={values.contactValue}
          aria-invalid={!!errors.contactValue}
          onChange={(e) => onChange('contactValue', e.target.value)}
        />
        {errors.contactValue && <span className={styles.error}>{errors.contactValue}</span>}
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
        <button className={styles.submitButton} type="submit" disabled={!isValid || isLoading}>
          {isLoading ? (
            <>
              <span style={{ marginRight: 8 }}>Отправка</span>
              <Spinner size={16} color="#ffffff" />
            </>
          ) : (
            'Отправить'
          )}
        </button>
      )}
    </form>
  );
}
