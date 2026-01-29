// src/modules/checkout/utils/orderTextBuilder.ts

import {
  ContactMethod,
  DeliveryService,
  OrderItem,
  OrderPayload,
  PaymentMethod,
} from '../types/checkoutTypes';

export function buildItemsText(items: OrderItem[]): string {
  return items
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} — ${item.quantity} × ${item.price} ₽ = ${
          item.quantity * item.price
        } ₽`,
    )
    .join('\n');
}

type OrderMessageMaps = {
  paymentMap: Record<PaymentMethod, string>;
  deliveryMap: Record<DeliveryService, string>;
  contactMap: Record<ContactMethod, string>;
};

function formatContactLink(method: ContactMethod, value: string): string {
  const cleanValue = value.trim();

  if (method === ContactMethod.TELEGRAM) {
    const username = cleanValue.replace(/^@/, '');
    return `https://t.me/${username}`;
  }

  if (method === ContactMethod.VK) {
    return cleanValue.includes('vk.com')
      ? cleanValue.startsWith('http')
        ? cleanValue
        : `https://${cleanValue}`
      : `https://vk.com/${cleanValue}`;
  }

  return cleanValue;
}

export function buildOrderData(
  params: {
    payload: OrderPayload;
  } & OrderMessageMaps,
) {
  const { payload, paymentMap, deliveryMap, contactMap } = params;
  const itemsText = buildItemsText(payload.items);

  const contactLink = formatContactLink(
    payload.customer.contactMethod,
    payload.customer.contactValue,
  );

  const text = `
    📦 ПОСТУПИЛ ЗАКАЗ!
    🆔 ID: ${payload.clientRequestId}
    👤 Клиент: ${payload.customer.fullName}
    📞 Тел: ${payload.customer.phone}
    🔗 Связь (${contactMap[payload.customer.contactMethod]}): ${contactLink}
    📍 Город: ${payload.customer.location}
    🚚 Доставка: ${deliveryMap[payload.delivery.service]}
    💳 Оплата: ${paymentMap[payload.payment.method]}
    💰 Итого: ${payload.total} ₽

    🛒 Состав заказа:
    ${itemsText}
`.trim();

  return {
    text,
    contactLink,
    contactMethodLabel: contactMap[payload.customer.contactMethod],
  };
}
