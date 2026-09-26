// src/app/api/feedback/route.ts

import { contactFormSchema } from '@/modules/contacts/model/contactFormSchema';
import { buildFeedbackData } from '@/modules/contacts/utils/feedbackTextBuilder';
import type { ApiError } from '@/shared/api/apiTypes';
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit';
import { sendTelegramMessage } from '@/shared/lib/telegram';
import { NextResponse } from 'next/server';

// Обращения пишут реже, чем оформляют заказы: 3 в минуту с одного IP
// достаточно живому человеку и отсекает спам формой.
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function errorResponse(status: number, message: string, details?: Record<string, string>) {
  return NextResponse.json({ message, details } satisfies Omit<ApiError, 'status'>, { status });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`feedback:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);

  if (!rateLimit.ok) {
    return errorResponse(429, 'Слишком много обращений подряд. Попробуйте через минуту.');
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse(400, 'Некорректный запрос');
  }

  const parsed = contactFormSchema.safeParse(json);

  if (!parsed.success) {
    const details: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const field = String(issue.path[0] ?? '');
      if (field && !details[field]) details[field] = issue.message;
    });
    return errorResponse(422, 'Проверьте заполнение формы', details);
  }

  const payload = parsed.data;

  // Honeypot: см. комментарий в /api/orders — отвечаем успехом, но никуда
  // не отправляем, чтобы бот не понял, что его отфильтровали.
  if (payload.website) {
    return NextResponse.json({ status: 'ok' });
  }

  const { text, contactLink } = buildFeedbackData(payload);

  const result = await sendTelegramMessage({
    text,
    button: contactLink
      ? { text: `💬 Написать в ${contactLink.label}`, url: contactLink.url }
      : undefined,
  });

  if (!result.ok) {
    if (result.reason === 'misconfigured') {
      return errorResponse(500, 'Сервис временно недоступен');
    }

    // Обращение не долетело до Telegram — логируем целиком, чтобы его можно
    // было восстановить вручную из логов.
    console.error('Failed to send feedback to Telegram', {
      error: result.error,
      status: result.status,
      payload,
    });
    return errorResponse(502, 'Не удалось отправить сообщение');
  }

  return NextResponse.json({ status: 'ok' });
}
