// src/app/api/orders/route.ts

import { buildOrderData } from '@/modules/checkout/utils/orderTextBuilder';
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit';
import { sendTelegramMessage } from '@/shared/lib/telegram';
import { NextResponse } from 'next/server';
import {
  contactMap,
  deliveryMap,
  paymentMap,
} from '../../../modules/checkout/mappers/orderMappers';
import { orderPayloadSchema, OrderPayloadSchema } from './payloadSchema';

// Не более 5 заказов в минуту с одного IP — защищает /api/orders от спама и
// перебора, не мешая живому пользователю.
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`orders:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);

  if (!rateLimit.ok) {
    return new Response('Too many requests', { status: 429 });
  }

  let payload: OrderPayloadSchema;

  try {
    const json = await req.json();
    payload = orderPayloadSchema.parse(json);
  } catch {
    return new Response('Invalid payload', { status: 400 });
  }

  // Honeypot: скрытое поле, которое реальный пользователь никогда не
  // заполнит. Если оно непустое — запрос почти наверняка от бота. Отвечаем
  // так, будто заказ принят, но никуда его не отправляем — это не даёт
  // ботам понять, что их отфильтровали, и подстраиваться.
  if (payload.website) {
    return NextResponse.json({
      status: 'ok',
      orderId: payload.clientRequestId,
    });
  }

  const { text, contactLink, contactMethodLabel } = buildOrderData({
    payload,
    paymentMap,
    deliveryMap,
    contactMap,
  });

  const result = await sendTelegramMessage({
    text,
    linkPreviewUrl: contactLink,
    button: { text: `💬 Написать в ${contactMethodLabel}`, url: contactLink },
  });

  if (!result.ok) {
    if (result.reason === 'misconfigured') {
      return new Response('Server misconfigured', { status: 500 });
    }

    // Заказ прошёл валидацию, но не долетел до Telegram — логируем тело
    // заказа целиком, чтобы его можно было восстановить вручную из логов
    // (см. IT задачи pre MVP: "Console.error").
    console.error('Failed to send order to Telegram', {
      error: result.error,
      status: result.status,
      payload,
    });
    return new Response(result.error, { status: 502 });
  }

  return NextResponse.json({
    status: 'ok',
    orderId: payload.clientRequestId,
  });
}
