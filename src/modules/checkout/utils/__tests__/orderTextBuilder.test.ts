// src/modules/checkout/utils/__tests__/orderTextBuilder.test.ts

import { contactMap, deliveryMap, paymentMap } from '../../mappers/orderMappers';
import {
  ContactMethod,
  DeliveryService,
  OrderPayload,
  PaymentMethod,
} from '../../types/checkoutTypes';
import { buildOrderData } from '../orderTextBuilder';

function contactLinkFor(contactMethod: ContactMethod, contactValue: string) {
  const payload: OrderPayload = {
    clientRequestId: '1',
    customer: {
      fullName: 'Иванов Иван',
      phone: '+7 (999) 000-00-00',
      contactMethod,
      contactValue,
      location: 'г Москва',
    },
    delivery: { service: DeliveryService.CDEK },
    payment: { method: PaymentMethod.CARD_TRANSFER },
    items: [{ id: '1', title: 'Цевьё', price: 3500, quantity: 1 }],
    total: 3500,
  };

  return buildOrderData({ payload, paymentMap, deliveryMap, contactMap }).contactLink;
}

describe('buildOrderData — ссылка для связи', () => {
  it.each([
    ['https://vk.ru/chupaold', 'https://vk.ru/chupaold'],
    ['vk.ru/chupaold', 'https://vk.ru/chupaold'],
    ['vk.com/id123', 'https://vk.com/id123'],
    ['m.vk.com/chupaold', 'https://m.vk.com/chupaold'],
  ])('VK: %s → %s', (value, expected) => {
    expect(contactLinkFor(ContactMethod.VK, value)).toBe(expected);
  });

  it('Telegram: @username → t.me', () => {
    expect(contactLinkFor(ContactMethod.TELEGRAM, '@ivan_petrov')).toBe('https://t.me/ivan_petrov');
  });
});
