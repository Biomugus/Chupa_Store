import { OrderPayload } from '../types/checkoutTypes';

async function sendOrder(payload: OrderPayload): Promise<void> {
  // ВРЕМЕННО
  await new Promise((resolve) => setTimeout(resolve, 4000));

  // эмулируем случайную ошибку
  if (Math.random() < 0.4) {
    throw new Error('Ошибка отправки заказа');
  }
}

export default sendOrder;
