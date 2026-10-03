import type { ApiError } from './apiTypes';

// Без таймаута зависшее соединение (блокировка, обрыв сети) оставляет форму в
// «отправке» навсегда. Больше серверных таймаутов (Telegram — 10 с), чтобы при
// живой сети клиент успел получить ответ сервера с ошибкой.
const REQUEST_TIMEOUT_MS = 15 * 1000;

export async function httpClient<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      ...init,
    });
  } catch (networkError) {
    throw {
      status: 0,
      message:
        (networkError as { name?: string } | null)?.name === 'TimeoutError'
          ? 'Request timeout'
          : 'Network error',
      cause: networkError,
    } satisfies ApiError;
  }

  if (!response.ok) {
    // JSON-тело в формате ADR 0002 ({ message, details }) — пробрасываем как есть,
    // чтобы формы могли показать details по полям; иначе — текст ответа.
    if (response.headers.get('content-type')?.includes('application/json')) {
      const body = (await response.json().catch(() => null)) as Partial<ApiError> | null;

      throw {
        status: response.status,
        message: body?.message ?? response.statusText,
        details: body?.details,
      } satisfies ApiError;
    }

    const message = await response.text();

    throw {
      status: response.status,
      message,
    } satisfies ApiError;
  }

  return response.json() as Promise<T>;
}
