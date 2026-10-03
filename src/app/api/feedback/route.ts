// src/app/api/feedback/route.ts

import { saveFeedback, setFeedbackNotifications } from '@/modules/contacts/api/feedbackStorage';
import { contactFormSchema } from '@/modules/contacts/model/contactFormSchema';
import { CONTACT_TOPIC_LABELS } from '@/modules/contacts/model/contactTopics';
import { buildFeedbackData } from '@/modules/contacts/utils/feedbackTextBuilder';
import type { ApiError } from '@/shared/api/apiTypes';
import { notifyOwner } from '@/shared/lib/notifications';
import { checkRateLimit, getClientIp } from '@/shared/lib/rateLimit';
import { after, NextResponse } from 'next/server';

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

  // Honeypot: см. комментарий в /api/orders — отвечаем успехом, но ничего
  // не сохраняем и не отправляем, чтобы бот не понял, что его отфильтровали.
  if (payload.website) {
    return NextResponse.json({ status: 'ok' }, { status: 201 });
  }

  // Сначала сохраняем: обращение в БД — источник правды, уведомления — best-effort.
  const saved = await saveFeedback(payload);

  if (!saved.ok) {
    // Обращение не сохранилось — логируем целиком, чтобы его можно было
    // восстановить вручную из логов.
    console.error('Failed to save feedback', { error: saved.error, payload });
    return errorResponse(500, 'Не удалось отправить сообщение');
  }

  const { text, contactLink } = buildFeedbackData(payload);

  // after(): ответ уходит сразу, не дожидаясь Telegram, VK и SMTP.
  after(async () => {
    const summary = await notifyOwner({
      subject: `Обращение · ${CONTACT_TOPIC_LABELS[payload.topic]} · ${payload.name}`,
      text,
      link: contactLink ?? undefined,
    });
    await setFeedbackNotifications(saved.id, summary);
  });

  return NextResponse.json({ status: 'ok' }, { status: 201 });
}
