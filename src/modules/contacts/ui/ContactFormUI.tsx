// src/modules/contacts/ui/ContactFormUI.tsx

'use client';

import { CircleCheck, Lock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import btnStyles from '@/shared/ui/buttons/buttons.module.css';
import { fieldControlClassName } from '@/shared/ui/form/fieldControl';
import formStyles from '@/shared/ui/form/form.module.css';
import { Honeypot } from '@/shared/ui/form/Honeypot';
import Spinner from '@/shared/ui/spinner/Spinner';

import { MESSAGE_MAX_LENGTH } from '../model/contactFormSchema';
import {
  CONTACT_TOPIC_LABELS,
  CONTACT_TOPIC_PLACEHOLDERS,
  CONTACT_TOPIC_VALUES,
} from '../model/contactTopics';
import type {
  ContactFormData,
  ContactFormErrors,
  ContactFormField,
  ContactTopic,
} from '../types/contactTypes';
import styles from './contactFormUI.module.css';

export type ContactFormStatus = 'idle' | 'loading' | 'success' | 'error';

export const getContactFieldId = (field: ContactFormField) => `contact-form-${field}`;

// Текст, который пользователь вводит сам (email, @username, сообщение),
// показываем как есть — без глобального uppercase для input.
const textControlClassName = cn(
  fieldControlClassName,
  'normal-case tracking-normal font-normal placeholder:text-black/40',
);

type ContactFormUIProps = {
  values: ContactFormData;
  errors: ContactFormErrors;
  status: ContactFormStatus;
  submitError: string | null;
  fallbackLinks: { telegram: string; whatsapp: string };
  onChange: <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => void;
  onBlur: (field: ContactFormField) => void;
  onSubmit: () => void;
  onRetry: () => void;
  onReset: () => void;
};

export function ContactFormUI({
  values,
  errors,
  status,
  submitError,
  fallbackLinks,
  onChange,
  onBlur,
  onSubmit,
  onRetry,
  onReset,
}: ContactFormUIProps) {
  const isLoading = status === 'loading';

  if (status === 'success') {
    return (
      <div className={cn(formStyles.formCard, styles.success)} role="status">
        <CircleCheck className={styles.successIcon} aria-hidden="true" />
        <h3 className={styles.successTitle}>Спасибо! Сообщение отправлено</h3>
        <p className={styles.successText}>
          Ответим вам в ближайшее время по контакту, который вы указали.
        </p>
        <button type="button" className={btnStyles.btnOutline} onClick={onReset}>
          Отправить ещё одно
        </button>
      </div>
    );
  }

  const describedBy = (field: ContactFormField, extra?: string) =>
    cn(errors[field] && `${getContactFieldId(field)}-error`, extra) || undefined;

  const fieldError = (field: ContactFormField) =>
    errors[field] ? (
      <p id={`${getContactFieldId(field)}-error`} className={formStyles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      className={formStyles.formCard}
      noValidate
      aria-busy={isLoading}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Honeypot value={values.website} onChange={(val) => onChange('website', val)} />

      <div className={formStyles.field}>
        <label htmlFor={getContactFieldId('name')} className={formStyles.label}>
          Ваше имя
        </label>
        <Input
          id={getContactFieldId('name')}
          name="name"
          autoComplete="name"
          className={cn(textControlClassName, errors.name && 'border-red-500')}
          placeholder="Иван"
          value={values.name}
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy('name')}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
        />
        {fieldError('name')}
      </div>

      <div className={formStyles.field}>
        <label htmlFor={getContactFieldId('contact')} className={formStyles.label}>
          Как с вами связаться
        </label>
        <Input
          id={getContactFieldId('contact')}
          name="contact"
          autoComplete="email"
          className={cn(textControlClassName, errors.contact && 'border-red-500')}
          placeholder="Телефон, @telegram или email"
          value={values.contact}
          disabled={isLoading}
          aria-invalid={!!errors.contact}
          aria-describedby={describedBy('contact')}
          onChange={(e) => onChange('contact', e.target.value)}
          onBlur={() => onBlur('contact')}
        />
        {fieldError('contact')}
      </div>

      <div className={formStyles.field}>
        <label htmlFor={getContactFieldId('topic')} className={formStyles.label}>
          Тема обращения
        </label>
        <Select
          value={values.topic}
          disabled={isLoading}
          onValueChange={(val) => onChange('topic', val as ContactTopic)}
        >
          <SelectTrigger
            id={getContactFieldId('topic')}
            className={cn(fieldControlClassName, errors.topic && 'border-red-500')}
            aria-invalid={!!errors.topic}
            aria-describedby={describedBy('topic')}
          >
            <SelectValue placeholder="Выберите тему" />
          </SelectTrigger>
          <SelectContent className="bg-[white] border-black text-black max-w-[95vw]">
            {CONTACT_TOPIC_VALUES.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {CONTACT_TOPIC_LABELS[topic]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldError('topic')}
      </div>

      <div className={formStyles.field}>
        <label htmlFor={getContactFieldId('message')} className={formStyles.label}>
          Сообщение
        </label>
        <Textarea
          id={getContactFieldId('message')}
          name="message"
          rows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          className={cn(textControlClassName, styles.textarea, errors.message && 'border-red-500')}
          placeholder={CONTACT_TOPIC_PLACEHOLDERS[values.topic]}
          value={values.message}
          disabled={isLoading}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message', `${getContactFieldId('message')}-counter`)}
          onChange={(e) => onChange('message', e.target.value)}
          onBlur={() => onBlur('message')}
        />
        <div className={styles.messageMeta}>
          {fieldError('message') ?? <span />}
          <span id={`${getContactFieldId('message')}-counter`} className={styles.counter}>
            {values.message.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
      </div>

      {submitError ? (
        <div className={formStyles.submitErrorWrapper} role="alert">
          <p className={formStyles.error}>{submitError}</p>
          <button
            className={formStyles.submitError}
            type="button"
            onClick={onRetry}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={{ marginRight: 8 }}>Повторная отправка</span>
                <Spinner size={18} color="#e5484d" />
              </>
            ) : (
              'Повторить попытку'
            )}
          </button>
          <p className={styles.fallback}>
            Или напишите нам напрямую в{' '}
            <a href={fallbackLinks.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>{' '}
            или{' '}
            <a href={fallbackLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>
      ) : (
        <button
          className={cn(btnStyles.btnOutline, formStyles.submitButton)}
          type="submit"
          disabled={isLoading}
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

      <p className={styles.consent}>
        <Lock className={styles.consentIcon} aria-hidden="true" />
        Нажимая «Отправить», вы соглашаетесь на обработку персональных данных. Используем их только
        для ответа на ваше обращение.
      </p>
    </form>
  );
}
