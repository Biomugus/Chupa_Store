import { OrderItem } from '../types/checkoutTypes';

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

export function buildOrderMessage(params: {
  payload: any;
  paymentMap: Record<string, string>;
  deliveryMap: Record<string, string>;
  contactMap: Record<string, string>;
}) {
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
