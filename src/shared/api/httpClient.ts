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
    const message = await response.text();

    throw {
      status: response.status,
      message,
    } satisfies ApiError;
  }

  return response.json() as Promise<T>;
}
