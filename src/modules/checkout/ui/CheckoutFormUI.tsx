// src/modules/checkout/ui/CheckoutFormUI.tsx

'use client';

import {
  CheckoutFormUIProps,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../types/checkoutTypes';

import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import { fieldControlClassName } from '@/shared/ui/form/fieldControl';
import formStyles from '@/shared/ui/form/form.module.css';
import { Honeypot } from '@/shared/ui/form/Honeypot';
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
      className={cn(formStyles.formCard, styles.form)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Honeypot value={values.website} onChange={(val) => onChange('website', val)} />

      {/* Location */}
      <div className={formStyles.field}>
        <label htmlFor="location" className={formStyles.label}>
          Город
        </label>
        <div className="w-full">
          <CityAutocompleteUI {...cityAutocompleteProps} />
        </div>
        {errors.location && <p className={formStyles.error}>{errors.location}</p>}
      </div>

      {/* Surname + name */}
      <div className={formStyles.field}>
        <label htmlFor="fullName" className={formStyles.label}>
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
        {errors.fullName && <p className={formStyles.error}>{errors.fullName}</p>}
      </div>

      {/* tel */}
      <div className={formStyles.field}>
        <label htmlFor="phone" className={formStyles.label}>
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
        {errors.phone && <p className={formStyles.error}>{errors.phone}</p>}
      </div>

      {/* Payment method */}
      <div className={formStyles.field}>
        <label htmlFor="paymentMethod" className={formStyles.label}>
          Способ оплаты
        </label>
        <Select
          value={values.paymentMethod}
          onValueChange={(val) => onChange('paymentMethod', val as PaymentMethod)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите способ" />
          </SelectTrigger>

          <SelectContent className="bg-[white] border-black text-black max-w-[95vw]">
            <SelectItem value={PaymentMethod.CARD_TRANSFER}>Перевод на карту</SelectItem>
            <SelectItem value={PaymentMethod.LEGAL_ENTITY}>Оплата через юр. лицо</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* delivery service */}
      <div className={formStyles.field}>
        <label className={formStyles.label}>Служба доставки</label>
        <Select
          value={values.deliveryService}
          onValueChange={(val) => onChange('deliveryService', val as DeliveryService)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите службу" />
          </SelectTrigger>
          <SelectContent className="bg-[white] border-black text-black max-w-[95vw]">
            <SelectItem value={DeliveryService.CDEK}>СДЭК</SelectItem>
            <SelectItem value={DeliveryService.POST_RUSSIA}>Почта России</SelectItem>
            <SelectItem value={DeliveryService.YANDEX}>Яндекс Доставка</SelectItem>
            <SelectItem value={DeliveryService.DPD}>DPD</SelectItem>
            <SelectItem value={DeliveryService.PONY_EXPRESS}>Pony Express</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Communication method */}
      <div className={formStyles.field}>
        <label className={formStyles.label}>Способ связи</label>
        <Select
          value={values.contactMethod}
          onValueChange={(val) => onChange('contactMethod', val as ContactMethod)}
        >
          <SelectTrigger className={fieldControlClassName}>
            <SelectValue placeholder="Выберите способ связи" />
          </SelectTrigger>
          <SelectContent className="bg-[white] border-black text-black max-w-[95vw]">
            <SelectItem value={ContactMethod.TELEGRAM}>Telegram</SelectItem>
            <SelectItem value={ContactMethod.VK}>VK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact */}
      <div className={formStyles.field}>
        <label htmlFor="contactValue" className={formStyles.label}>
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
        {errors.contactValue && <span className={formStyles.error}>{errors.contactValue}</span>}
      </div>

      {/* Submit Error / Retry */}
      {submitError ? (
        <div className={formStyles.submitErrorWrapper}>
          <p className={formStyles.error}>{submitError}</p>
          <button
            className={formStyles.submitError}
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
          className={`${btnStyles.btnOutline} ${formStyles.submitButton}`}
          type="submit"
          disabled={!isValid || isLoading}
        >
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
