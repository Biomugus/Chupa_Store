import { CreateOrderResponse, OrderPayload } from '../types/checkoutTypes';
import { ApiError } from '@/shared/api/apiTypes';
// import { httpClient } from '@/shared/api/httpClient';

const USE_MOCK = true;

export default async function sendOrder(
  payload: OrderPayload
): Promise<CreateOrderResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const random = Math.random();

    if (random < 0.3) {
      throw { status: 500, message: 'Серверная ошибка (мок)' } as ApiError;
    }

    if (random >= 0.3 && random < 0.5) {
      throw {
        status: 400,
        message: 'Ошибка валидации: данные формы некорректны (мок)',
        details: {
          phone: 'Неверный формат номера',
          contactValue: 'Неверный Telegram ID',
        },
      } as ApiError;
    }

    return {
      status: 'ok',
      orderId: payload.clientRequestId,
    };
  }

  // --- Реальный бэк (пока закомментирован) ---
  // const response = await httpClient<CreateOrderResponse>('/api/orders', {
  //   method: 'POST',
  //   body: JSON.stringify(payload),
  // });
  // if (!response) throw { status: 500, message: 'Сервер не ответил' } as ApiError;
  // return response;

  // Если USE_MOCK отключен и бэка пока нет — явно бросаем ошибку
  throw new Error('sendOrder: бэкенд пока не подключен');
}
