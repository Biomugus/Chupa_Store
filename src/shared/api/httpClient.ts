import type { ApiError } from './apiTypes';

export async function httpClient<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch (networkError) {
    throw {
      status: 0,
      message: 'Network error',
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
