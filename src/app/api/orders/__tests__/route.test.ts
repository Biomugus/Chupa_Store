/**
 * @jest-environment node
 */

// src/app/api/orders/__tests__/route.test.ts

import { saveOrder, setOrderNotifications } from '@/modules/checkout/api/orderStorage';
import { notifyOwner } from '@/shared/lib/notifications';
import { POST } from '../route';

const afterCallbacks: Array<() => Promise<void>> = [];

jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  after: (callback: () => Promise<void>) => afterCallbacks.push(callback),
}));
jest.mock('@/modules/checkout/api/orderStorage', () => ({
  saveOrder: jest.fn(),
  setOrderNotifications: jest.fn(),
}));
jest.mock('@/shared/lib/notifications', () => ({ notifyOwner: jest.fn() }));

const saveOrderMock = saveOrder as jest.Mock;
const notifyOwnerMock = notifyOwner as jest.Mock;

const payload = {
  clientRequestId: '3f1c2b7e-4a5d-4e6f-8a9b-0c1d2e3f4a5b',
  customer: {
    fullName: 'Иван Петров',
    phone: '+7 (999) 999-99-99',
    contactMethod: 'telegram',
    contactValue: '@ivan_petrov',
    location: 'Москва',
  },
  delivery: { service: 'cdek' },
  payment: { method: 'card_transfer' },
  items: [{ id: 'p1', title: 'Приклад', price: 15000, quantity: 1 }],
  total: 15000,
  website: '',
};

// Свой IP на каждый запрос — чтобы тесты не упирались в in-memory rate limit.
let ipCounter = 0;
function request(body: unknown) {
  return new Request('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${++ipCounter}` },
    body: JSON.stringify(body),
  });
}

let consoleError: jest.SpyInstance;

beforeEach(() => {
  afterCallbacks.length = 0;
  notifyOwnerMock.mockResolvedValue({ telegram: 'ok', vk: 'ok', email: 'ok' });
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
});

describe('POST /api/orders', () => {
  it('сохраняет заказ, отвечает 201 и уведомляет после ответа', async () => {
    saveOrderMock.mockResolvedValue({ ok: true, id: 'row-1', created: true });

    const res = await POST(request(payload));

    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({ status: 'ok', orderId: payload.clientRequestId });
    expect(saveOrderMock).toHaveBeenCalledWith(expect.objectContaining({ total: 15000 }));

    // Уведомления запланированы через after(), а не отправлены до ответа.
    expect(notifyOwnerMock).not.toHaveBeenCalled();
    expect(afterCallbacks).toHaveLength(1);

    await afterCallbacks[0]();

    expect(notifyOwnerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Заказ · Иван Петров · 15000 ₽',
        link: { label: 'Telegram', url: 'https://t.me/ivan_petrov' },
      }),
    );
    expect(setOrderNotifications).toHaveBeenCalledWith('row-1', {
      telegram: 'ok',
      vk: 'ok',
      email: 'ok',
    });
  });

  it('повтор с тем же clientRequestId отвечает тем же orderId без повторных уведомлений', async () => {
    saveOrderMock.mockResolvedValue({ ok: true, id: 'row-1', created: false });

    const res = await POST(request(payload));

    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({ status: 'ok', orderId: payload.clientRequestId });
    expect(afterCallbacks).toHaveLength(0);
  });

  it('при ошибке БД отвечает 500 и логирует заказ целиком', async () => {
    saveOrderMock.mockResolvedValue({ ok: false, error: 'connection refused' });

    const res = await POST(request(payload));

    expect(res.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to save order',
      expect.objectContaining({ payload: expect.objectContaining({ total: 15000 }) }),
    );
    expect(afterCallbacks).toHaveLength(0);
  });

  it('honeypot: отвечает как при успехе, но ничего не сохраняет', async () => {
    const res = await POST(request({ ...payload, website: 'spam' }));

    expect(res.status).toBe(201);
    expect(saveOrderMock).not.toHaveBeenCalled();
    expect(afterCallbacks).toHaveLength(0);
  });

  it('невалидный payload (clientRequestId не UUID) — 400 без сохранения', async () => {
    const res = await POST(request({ ...payload, clientRequestId: 'abc' }));

    expect(res.status).toBe(400);
    expect(saveOrderMock).not.toHaveBeenCalled();
  });
});
