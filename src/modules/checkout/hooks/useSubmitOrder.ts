'use client';

import { useCallback, useRef, useState } from 'react';
import { buildOrderPayload } from '../model/buildOrderPayload';
import { CartSnapshot, CheckoutFormData, OrderPayload } from '../types/checkoutTypes';

import sendOrder from '../services/sendOrder';

import type { ApiError } from '@/shared/api/apiTypes';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const FALLBACK_MESSAGE = 'Не удалось отправить заказ. Попробуйте ещё раз';

// /api/orders отвечает техническим текстом (`Invalid payload`, `Failed to save order`),
// показывать его покупателю нельзя — подбираем сообщение по статусу.
function normalizeError(err: unknown): string {
  const apiErr = err as Partial<ApiError> | null;

  if (apiErr && typeof apiErr.status === 'number') {
    if (apiErr.status === 0) return 'Нет соединения. Проверьте интернет и попробуйте ещё раз';
    if (apiErr.status === 429) return 'Слишком много попыток. Подождите минуту и попробуйте снова';
  }

  return FALLBACK_MESSAGE;
}

export function useSubmitOrder(cart: CartSnapshot) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const lastPayloadRef = useRef<OrderPayload | null>(null);

  const submitOrder = useCallback(
    async (formData: CheckoutFormData) => {
      setStatus('loading');
      setError(null);

      if (!lastPayloadRef.current) {
        lastPayloadRef.current = buildOrderPayload(cart, formData);
      }

      try {
        await sendOrder(lastPayloadRef.current);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(normalizeError(err));
      }
    },
    [cart],
  );

  const retry = useCallback(async () => {
    if (!lastPayloadRef.current) return;

    setStatus('loading');

    try {
      await sendOrder(lastPayloadRef.current);
      setStatus('success');
      setError(null);
    } catch (err) {
      setStatus('error');
      setError(normalizeError(err));
    }
  }, []);

  const resetStatus = useCallback(() => {
    setStatus('idle');
    setError(null);
    lastPayloadRef.current = null;
  }, []);

  return {
    submitOrder,
    retry,
    status,
    error,
    resetStatus,
  };
}
