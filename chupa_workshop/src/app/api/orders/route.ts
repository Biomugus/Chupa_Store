import { NextResponse } from 'next/server';
import { orderPayloadSchema, OrderPayloadSchema } from './payloadSchema';
import {
  paymentMap,
  deliveryMap,
  contactMap,
} from '../../../modules/checkout/mappers/orderMappers';
import { buildOrderMessage } from '@/modules/checkout/utils/orderTextBuilder';

export async function POST(req: Request) {
  let payload: OrderPayloadSchema;

  try {
    const json = await req.json();
    payload = orderPayloadSchema.parse(json);
  } catch (err) {
    console.error('Invalid payload', err);
    return new Response('Invalid payload', { status: 400 });
  }

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    return new Response('Server misconfigured', { status: 500 });
  }

  const message = buildOrderMessage({
    payload,
    paymentMap,
    deliveryMap,
    contactMap,
  });

  const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  if (!tgResponse.ok) {
    const error = await tgResponse.text();
    return new Response(error, { status: 502 });
  }

  return NextResponse.json({
    status: 'ok',
    orderId: payload.clientRequestId,
  });
}
