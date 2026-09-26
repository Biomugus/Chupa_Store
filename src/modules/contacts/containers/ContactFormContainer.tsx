// src/modules/contacts/containers/ContactFormContainer.tsx

'use client';

import { useCallback } from 'react';

import { WORKSHOP_CONTACTS } from '@/shared/config/contacts';

import { useContactForm } from '../hooks/useContactForm';
import { useSubmitFeedback } from '../hooks/useSubmitFeedback';
import type { ContactFormData, ContactFormField, ContactTopic } from '../types/contactTypes';
import { ContactFormUI, getContactFieldId } from '../ui/ContactFormUI';

const FALLBACK_LINKS = {
  telegram: WORKSHOP_CONTACTS.telegram.url,
  whatsapp: WORKSHOP_CONTACTS.whatsapp.url,
};

function focusField(field: ContactFormField | null) {
  if (!field) return;
  // Ждём коммита рендера: поле могло быть disabled во время отправки.
  requestAnimationFrame(() => document.getElementById(getContactFieldId(field))?.focus());
}

type ContactFormContainerProps = {
  initialTopic: ContactTopic;
};

export default function ContactFormContainer({ initialTopic }: ContactFormContainerProps) {
  const { values, errors, handleChange, handleBlur, handleSubmit, applyServerErrors, reset } =
    useContactForm(initialTopic);
  const { submit, status, error, resetStatus } = useSubmitFeedback();

  const handleApiResult = useCallback(
    (apiError: Awaited<ReturnType<typeof submit>>) => {
      if (apiError?.details) focusField(applyServerErrors(apiError.details));
    },
    [applyServerErrors],
  );

  const onSubmit = useCallback(() => {
    const invalid = handleSubmit((data: ContactFormData) => {
      void submit(data).then(handleApiResult);
    });
    focusField(invalid);
  }, [handleApiResult, handleSubmit, submit]);

  const onReset = useCallback(() => {
    reset();
    resetStatus();
  }, [reset, resetStatus]);

  // Ошибки валидации сервера показываем у полей, а не общим баннером с «Повторить».
  const submitError = status === 'error' && !Object.values(errors).some(Boolean) ? error : null;

  return (
    <ContactFormUI
      values={values}
      errors={errors}
      status={status}
      submitError={submitError}
      fallbackLinks={FALLBACK_LINKS}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={onSubmit}
      // «Повторить» отправляет текущие значения — пользователь мог их поправить.
      onRetry={onSubmit}
      onReset={onReset}
    />
  );
}
