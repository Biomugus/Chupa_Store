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

export function buildOrderMessage(
  params: {
    payload: OrderPayload;
  } & OrderMessageMaps,
) {
  const { payload, paymentMap, deliveryMap, contactMap } = params;
  const itemsText = buildItemsText(payload.items);

  return `
    ПОСТУПИЛ ЗАКАЗ !
    ID заказа: ${payload.clientRequestId}
    Отправитель: ${payload.customer.fullName}
    Телефон: ${payload.customer.phone}
    Метод связи: ${contactMap[payload.customer.contactMethod]} - ${payload.customer.contactValue}
    Локация: ${payload.customer.location}
    Доставка: ${deliveryMap[payload.delivery.service]}
    Оплата: ${paymentMap[payload.payment.method]}
    Сумма товаров: ${payload.total}₽

    Список товаров:
    ${itemsText}
`;
}
