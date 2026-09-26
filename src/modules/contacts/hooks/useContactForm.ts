// src/modules/contacts/hooks/useContactForm.ts

'use client';

import { useCallback, useState } from 'react';
import { contactFormSchema } from '../model/contactFormSchema';
import type {
  ContactFormData,
  ContactFormErrors,
  ContactFormField,
  ContactTopic,
} from '../types/contactTypes';

/** Порядок полей в форме — по нему фокусируем первое невалидное. */
export const CONTACT_FORM_FIELDS: ContactFormField[] = ['name', 'contact', 'topic', 'message'];

function createInitialValues(topic: ContactTopic): ContactFormData {
  return { name: '', contact: '', topic, message: '', website: '' };
}

function validate(data: ContactFormData): ContactFormErrors {
  const result = contactFormSchema.safeParse(data);
  if (result.success) return {};

  const nextErrors: ContactFormErrors = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as ContactFormField;
    if (field && !nextErrors[field]) {
      nextErrors[field] = issue.message;
    }
  });
  return nextErrors;
}

function firstInvalidField(errors: ContactFormErrors): ContactFormField | null {
  return CONTACT_FORM_FIELDS.find((field) => errors[field]) ?? null;
}

export function useContactForm(initialTopic: ContactTopic) {
  const [values, setValues] = useState<ContactFormData>(() => createInitialValues(initialTopic));
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});

  // Переход по ссылке сценария (?topic=...) на уже открытой странице меняет
  // initialTopic без ремаунта — подставляем новую тему в форму.
  const [prevTopic, setPrevTopic] = useState(initialTopic);
  if (prevTopic !== initialTopic) {
    setPrevTopic(initialTopic);
    setValues((prev) => ({ ...prev, topic: initialTopic }));
  }

  const handleChange = useCallback(
    <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => {
      const next = { ...values, [field]: value };
      setValues(next);

      // Ошибку поля обновляем «на лету», только если пользователь уже с ним
      // взаимодействовал — чтобы не ругаться на первый введённый символ.
      if (field !== 'website' && touched[field as ContactFormField]) {
        setErrors((prev) => ({ ...prev, [field]: validate(next)[field as ContactFormField] }));
      }
    },
    [touched, values],
  );

  const handleBlur = useCallback(
    (field: ContactFormField) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
    },
    [values],
  );

  /** Возвращает первое невалидное поле или null, если данные ушли в onValid. */
  const handleSubmit = useCallback(
    (onValid: (data: ContactFormData) => void): ContactFormField | null => {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      setTouched({ name: true, contact: true, topic: true, message: true });

      const invalid = firstInvalidField(validationErrors);
      if (!invalid) onValid(values);
      return invalid;
    },
    [values],
  );

  /** Ошибки по полям из ответа сервера (ApiError.details). */
  const applyServerErrors = useCallback((details: Record<string, string>) => {
    const serverErrors: ContactFormErrors = {};
    CONTACT_FORM_FIELDS.forEach((field) => {
      if (details[field]) serverErrors[field] = details[field];
    });
    setErrors(serverErrors);
    return firstInvalidField(serverErrors);
  }, []);

  const reset = useCallback(() => {
    setValues((prev) => createInitialValues(prev.topic));
    setErrors({});
    setTouched({});
  }, []);

  return { values, errors, handleChange, handleBlur, handleSubmit, applyServerErrors, reset };
}
