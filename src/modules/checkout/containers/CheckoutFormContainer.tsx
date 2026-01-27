// src/modules/checkout/containers/CheckoutFormContainer.tsx

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { useCitySuggestions } from '../hooks/useCitySuggestions';
import { useSubmitOrder } from '../hooks/useSubmitOrder';
import { CheckoutFormContainerProps } from '../types/checkoutTypes';
import { CheckoutFormUI } from '../ui/CheckoutFormUI';

export default function CheckoutFormContainer({
  cartSnapshot,
  onOpenSuccessModal,
}: CheckoutFormContainerProps) {
  const [cityOpen, setCityOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const { values, errors, isValid, handleChange, handleSubmit, reset } = useCheckoutForm();
  const { submitOrder, retry, status, error, resetStatus } = useSubmitOrder(cartSnapshot);

  const { suggestions, isLoading } = useCitySuggestions(inputText);

  const selectedCity = values.location;
  const submitError = error;
  const isRetry = isLoading && error !== null;

  const handleCitySelect = useCallback(
    (city: string) => {
      handleChange('location', city);
    },
    [handleChange],
  );

  const handleInputChange = useCallback((val: string) => {
    setInputText(val);
  }, []);

  const mappedSuggestions = useMemo(
    () => suggestions.map(({ value }) => ({ value })),
    [suggestions],
  );

  useEffect(() => {
    if (status !== 'success') return;

    reset();
    onOpenSuccessModal();
    resetStatus();
  }, [onOpenSuccessModal, reset, resetStatus, status]);

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
      cityAutocompleteProps={{
        value: selectedCity,
        inputValue: inputText,
        onInputChange: handleInputChange,
        suggestions: mappedSuggestions,
        isLoading,
        onSelect: handleCitySelect,
        open: cityOpen,
        onOpenChange: setCityOpen,
      }}
    />
  );
}
