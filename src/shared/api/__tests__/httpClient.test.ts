/**
 * @jest-environment node
 */

// src/shared/api/__tests__/httpClient.test.ts

import { httpClient } from '../httpClient';

const fetchMock = jest.fn();

beforeEach(() => {
  global.fetch = fetchMock;
});

describe('httpClient', () => {
  it('по умолчанию ограничивает запрос таймаутом', async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true }));

    await httpClient('/api/orders');

    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('сохраняет signal, переданный вызывающим кодом', async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true }));
    const controller = new AbortController();

    await httpClient('/api/orders', { signal: controller.signal });

    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal);
  });

  it('при таймауте бросает ApiError со status 0', async () => {
    fetchMock.mockRejectedValue(new DOMException('The operation timed out', 'TimeoutError'));

    await expect(httpClient('/api/orders')).rejects.toMatchObject({
      status: 0,
      message: 'Request timeout',
    });
  });

  it('при обрыве сети бросает ApiError со status 0', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(httpClient('/api/orders')).rejects.toMatchObject({
      status: 0,
      message: 'Network error',
    });
  });
});
