// src/modules/checkout/hooks/useCheckoutForm.ts

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkoutSchema } from '../shemas/checkoutShema';
import {
  CheckoutFormData,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../types/checkoutTypes';
import { formatPhoneNumber } from '../utils/phoneFormatter';
type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;
type TouchedFields = Partial<Record<keyof CheckoutFormData, boolean>>;

const INITIAL_VALUES: CheckoutFormData = {
  location: '',
  paymentMethod: PaymentMethod.CARD_TRANSFER,
  deliveryService: DeliveryService.POST_RUSSIA,
  fullName: '',
  phone: '',
  contactMethod: ContactMethod.TELEGRAM,
  contactValue: '',
};

export function useCheckoutForm() {
  const [values, setValues] = useState<CheckoutFormData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const validate = useCallback((data: CheckoutFormData) => {
    const result = checkoutSchema.safeParse(data);
    if (result.success) return {};

    const nextErrors: CheckoutFormErrors = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof CheckoutFormData;
      if (field && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    });
    return nextErrors;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const validationErrors = validate(values);

      const filteredErrors: CheckoutFormErrors = {};
      Object.keys(validationErrors).forEach((key) => {
        const field = key as keyof CheckoutFormData;
        if (touched[field]) {
          filteredErrors[field] = validationErrors[field];
        }
      });

      setErrors(filteredErrors);
    }, 800);

    return () => clearTimeout(timer);
  }, [values, touched, validate]);

  const isValid = useMemo(() => {
    return checkoutSchema.safeParse(values).success;
  }, [values]);

  const handleChange = useCallback(
    <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
      setValues((prev) => ({
        ...prev,
        [field]: field === 'phone' ? formatPhoneNumber(value as string) : value,
      }));

      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (onValid: (data: CheckoutFormData) => void) => {
      const validationErrors = validate(values);
      const allTouched: TouchedFields = {};

      Object.keys(values).forEach((key) => {
        allTouched[key as keyof CheckoutFormData] = true;
      });
      setTouched(allTouched);

      if (Object.keys(validationErrors).length === 0) {
        onValid(values);
      } else {
        setErrors(validationErrors);
      }
    },
    [validate, values],
  );

  const reset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
  }, []);

  return {
    values,
    errors,
    setErrors,
    isValid,
    handleChange,
    handleSubmit,
    reset,
  };
}
