// src/modules/checkout/shemas/__tests__/checkoutShema.test.ts

import { orderPayloadSchema } from '@/app/api/orders/payloadSchema';
import {
  CheckoutFormData,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../../types/checkoutTypes';
import { checkoutSchema } from '../checkoutShema';

const baseForm: CheckoutFormData = {
  location: 'г Москва',
  paymentMethod: PaymentMethod.CARD_TRANSFER,
  deliveryService: DeliveryService.CDEK,
  fullName: 'Иванов Иван',
  phone: '+7 (999) 000-00-00',
  contactMethod: ContactMethod.VK,
  contactValue: '',
  website: '',
};

function isValidVk(contactValue: string) {
  const client = checkoutSchema.safeParse({ ...baseForm, contactValue }).success;
  const server = orderPayloadSchema.safeParse({
    clientRequestId: '1',
    customer: { ...baseForm, contactValue },
    delivery: { service: baseForm.deliveryService },
    payment: { method: baseForm.paymentMethod },
    items: [{ id: '1', title: 'Цевьё', price: 3500, quantity: 1 }],
    total: 3500,
  }).success;

  // Клиент и сервер проверяют ссылку одним правилом — расходиться не должны.
  expect(server).toBe(client);
  return client;
}

describe('checkoutSchema — ссылка VK', () => {
  it.each([
    'https://vk.ru/chupaold',
    'https://vk.com/chupaold',
    'vk.ru/chupaold',
    'vk.com/id123456',
    'https://m.vk.com/chupa.old',
    'https://www.vk.ru/chupaold/',
    ' https://vk.ru/chupaold ',
  ])('принимает %s', (value) => {
    expect(isValidVk(value)).toBe(true);
  });

  it.each([
    'chupaold',
    'https://vk.ru/',
    'https://ok.ru/chupaold',
    'https://notvk.com/chupaold',
    'мой профиль vk.com/chupaold',
  ])('отклоняет %s', (value) => {
    expect(isValidVk(value)).toBe(false);
  });
});
