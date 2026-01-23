import { CartSnapshot, CheckoutFormData, OrderPayload } from '../types/checkoutTypes';

export function buildOrderPayload(cart: CartSnapshot, form: CheckoutFormData): OrderPayload {
  return {
    clientRequestId: crypto.randomUUID(),

    customer: {
      fullName: form.fullName,
      phone: form.phone,
      contactMethod: form.contactMethod,
      contactValue: form.contactValue,
      location: form.location,
    },

    delivery: {
      service: form.deliveryService,
    },

    payment: {
      method: form.paymentMethod,
    },

    items: cart.items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity, // на случай, если вдруг undefined
    })),
    total: cart.total,
  };
}
