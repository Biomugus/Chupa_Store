// src/modules/contacts/hooks/useSubmitFeedback.ts

'use client';

import { useCallback, useState } from 'react';
import type { ApiError } from '@/shared/api/apiTypes';
import sendFeedback from '../services/sendFeedback';
import type { ContactFormData } from '../types/contactTypes';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const FALLBACK_MESSAGE = 'Не удалось отправить сообщение';

function normalizeError(err: unknown): ApiError {
  const apiErr = err as Partial<ApiError> | null;

  if (apiErr && typeof apiErr.status === 'number') {
    if (apiErr.status === 0) {
      return { status: 0, message: 'Нет соединения. Проверьте интернет и попробуйте ещё раз' };
    }
    return {
      status: apiErr.status,
      message: apiErr.message || FALLBACK_MESSAGE,
      details: apiErr.details,
    };
  }

  return { status: 500, message: FALLBACK_MESSAGE };
}

export function useSubmitFeedback() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /** Возвращает ApiError при неудаче — чтобы контейнер мог разложить details по полям. */
  const submit = useCallback(async (data: ContactFormData): Promise<ApiError | null> => {
    setStatus('loading');
    setError(null);

    try {
      await sendFeedback(data);
      setStatus('success');
      return null;
    } catch (err) {
      const normalized = normalizeError(err);
      setStatus('error');
      setError(normalized.message);
      return normalized;
    }
  }, []);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { submit, status, error, resetStatus };
}
