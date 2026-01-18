'use client';

import { useCallback, useRef, useState } from 'react';
import { buildOrderPayload } from '../model/buildOrderPayload';
import { CartSnapshot, CheckoutFormData, OrderPayload } from '../types/checkoutTypes';

import sendOrder from '../services/sendOrder';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function useSubmitOrder(cart: CartSnapshot) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const lastPayloadRef = useRef<OrderPayload | null>(null);

  const submitOrder = useCallback(
    async (formData: CheckoutFormData) => {
      setStatus('loading');
      setError(null);

      const payload = buildOrderPayload(cart, formData);
      lastPayloadRef.current = payload;

      try {
        await sendOrder(payload);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    },
    [cart]
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
      setError(err instanceof Error ? err.message : 'Unknown error');
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
