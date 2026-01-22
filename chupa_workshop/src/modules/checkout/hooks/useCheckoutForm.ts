'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  CheckoutFormData,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../types/checkoutTypes';

type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;

const INITIAL_VALUES: CheckoutFormData = {
  location: '',
  paymentMethod: PaymentMethod.CARD_TRANSFER,
  deliveryService: DeliveryService.POST_RUSSIA,
  fullName: '',
  phone: '',
  contactMethod: ContactMethod.TELEGRAM,
  contactValue: '',
};

const FULL_NAME_REGEX = /^[А-Яа-яЁё\s]+$/;
const PHONE_REGEX = /^\+7\d{10}$/;

export function useCheckoutForm() {
  const [values, setValues] = useState<CheckoutFormData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const validate = useCallback((data: CheckoutFormData): CheckoutFormErrors => {
    const nextErrors: CheckoutFormErrors = {};

    if (!data.location.trim()) {
      nextErrors.location = 'Укажите город';
    }

    if (!data.fullName.trim()) {
      nextErrors.fullName = 'Введите ФИО';
    } else if (!FULL_NAME_REGEX.test(data.fullName)) {
      nextErrors.fullName = 'Допустима только кириллица и пробелы';
    }

    if (!PHONE_REGEX.test(data.phone)) {
      nextErrors.phone = 'Введите номер в формате +7XXXXXXXXXX';
    }

    if (!data.contactValue.trim()) {
      nextErrors.contactValue =
        data.contactMethod === ContactMethod.VK
          ? 'Введите ссылку на VK'
          : 'Введите Telegram username';
    }

    return nextErrors;
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(validate(values)).length === 0;
  }, [values, validate]);

  const handleChange = useCallback(
    <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (onValid: (data: CheckoutFormData) => void) => {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onValid(values);
      }
    },
    [validate, values],
  );

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    reset,
  };
}
