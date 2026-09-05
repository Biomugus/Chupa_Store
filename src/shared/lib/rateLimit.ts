// src/shared/lib/rateLimit.ts
//
// Простой in-memory rate-limit по ключу (обычно IP). Подходит только для
// одного serverless-инстанса/процесса — при горизонтальном масштабировании
// или деплое на несколько инстансов лимиты не будут общими. Для MVP этого
// достаточно, для роста нагрузки стоит вынести в Redis/Upstash.

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Периодически подчищаем протухшие бакеты, чтобы Map не росла бесконечно.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Фиксированное окно (fixed window) rate-limit.
 *
 * @param key уникальный ключ (например `orders:1.2.3.4`)
 * @param limit максимум запросов за окно
 * @param windowMs длительность окна в миллисекундах
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Достаёт клиентский IP из заголовков запроса (Vercel/большинство прокси
 * проставляют x-forwarded-for/x-real-ip). Возвращает 'unknown', если
 * определить IP не удалось — тогда все такие запросы будут делить один
 * общий лимит, что всё ещё лучше, чем полное отсутствие лимита.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}
