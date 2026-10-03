// src/modules/checkout/hooks/__tests__/useSubmitOrder.test.ts

import { act, renderHook } from '@testing-library/react';
import sendOrder from '../../services/sendOrder';
import {
  CheckoutFormData,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../../types/checkoutTypes';
import { useSubmitOrder } from '../useSubmitOrder';

jest.mock('../../services/sendOrder', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const sendOrderMock = sendOrder as jest.MockedFunction<typeof sendOrder>;

const cart = { items: [{ id: '1', title: 'Цевьё', price: 3500, quantity: 1 }], total: 3500 };

const formData: CheckoutFormData = {
  location: 'г Москва',
  paymentMethod: PaymentMethod.CARD_TRANSFER,
  deliveryService: DeliveryService.CDEK,
  fullName: 'Иванов Иван',
  phone: '+7 (999) 000-00-00',
  contactMethod: ContactMethod.TELEGRAM,
  contactValue: '@ivan_petrov',
  website: '',
};

async function submitWithError(error: unknown) {
  sendOrderMock.mockRejectedValue(error);
  const { result } = renderHook(() => useSubmitOrder(cart));

  await act(() => result.current.submitOrder(formData));

  return result.current;
}

describe('useSubmitOrder', () => {
  it('пока заказ отправляется, status = loading', async () => {
    let resolveOrder!: () => void;
    sendOrderMock.mockReturnValue(
      new Promise((resolve) => {
        resolveOrder = () => resolve({ status: 'ok', orderId: '1' });
      }),
    );
    const { result } = renderHook(() => useSubmitOrder(cart));

    let submitting!: Promise<void>;
    act(() => {
      submitting = result.current.submitOrder(formData);
    });
    expect(result.current.status).toBe('loading');

    await act(async () => {
      resolveOrder();
      await submitting;
    });
    expect(result.current.status).toBe('success');
  });

  it('при сетевой ошибке или таймауте просит проверить соединение', async () => {
    const { status, error } = await submitWithError({ status: 0, message: 'Request timeout' });

    expect(status).toBe('error');
    expect(error).toBe('Нет соединения. Проверьте интернет и попробуйте ещё раз');
  });

  it('при 429 просит подождать', async () => {
    const { error } = await submitWithError({ status: 429, message: 'Too many requests' });

    expect(error).toBe('Слишком много попыток. Подождите минуту и попробуйте снова');
  });

  it('не показывает покупателю технический текст ответа сервера', async () => {
    const { error } = await submitWithError({ status: 502, message: '{"ok":false}' });

    expect(error).toBe('Не удалось отправить заказ. Попробуйте ещё раз');
  });
});
