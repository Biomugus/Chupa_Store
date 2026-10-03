// src/app/api/orders/route.ts

import { saveOrder, setOrderNotifications } from '@/modules/checkout/api/orderStorage';
import { buildOrderData } from '@/modules/checkout/utils/orderTextBuilder';
import { notifyOwner } from '@/shared/lib/notifications';
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit';
import { after, NextResponse } from 'next/server';
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
  // так, будто заказ принят, но никуда его не сохраняем и не отправляем — это
  // не даёт ботам понять, что их отфильтровали, и подстраиваться.
  if (payload.website) {
    return NextResponse.json({ status: 'ok', orderId: payload.clientRequestId }, { status: 201 });
  }

  // Сначала сохраняем: заказ в БД — источник правды, уведомления — best-effort.
  const saved = await saveOrder(payload);

  if (!saved.ok) {
    // Заказ не сохранился — логируем целиком, чтобы его можно было
    // восстановить вручную из логов.
    console.error('Failed to save order', { error: saved.error, payload });
    return new Response('Failed to save order', { status: 500 });
  }

  // Повтор того же заказа («Повторить попытку» после обрыва сети): уведомления
  // уже ушли с первого запроса, второй раз не шлём.
  if (saved.created) {
    const { text, contactLink, contactMethodLabel } = buildOrderData({
      payload,
      paymentMap,
      deliveryMap,
      contactMap,
    });

    // after(): покупатель получает ответ сразу, не дожидаясь Telegram, VK и SMTP.
    after(async () => {
      const summary = await notifyOwner({
        subject: `Заказ · ${payload.customer.fullName} · ${payload.total} ₽`,
        text,
        link: { label: contactMethodLabel, url: contactLink },
        linkPreviewUrl: contactLink,
      });
      await setOrderNotifications(saved.id, summary);
    });
  }

  return NextResponse.json({ status: 'ok', orderId: payload.clientRequestId }, { status: 201 });
}
