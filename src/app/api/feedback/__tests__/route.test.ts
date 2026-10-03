/**
 * @jest-environment node
 */

// src/app/api/feedback/__tests__/route.test.ts

import { saveFeedback, setFeedbackNotifications } from '@/modules/contacts/api/feedbackStorage';
import { notifyOwner } from '@/shared/lib/notifications';
import { POST } from '../route';

const afterCallbacks: Array<() => Promise<void>> = [];

jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  after: (callback: () => Promise<void>) => afterCallbacks.push(callback),
}));
jest.mock('@/modules/contacts/api/feedbackStorage', () => ({
  saveFeedback: jest.fn(),
  setFeedbackNotifications: jest.fn(),
}));
jest.mock('@/shared/lib/notifications', () => ({ notifyOwner: jest.fn() }));

const saveFeedbackMock = saveFeedback as jest.Mock;
const notifyOwnerMock = notifyOwner as jest.Mock;

const payload = {
  name: 'Иван',
  contact: 'https://vk.ru/ivan',
  topic: 'custom',
  message: 'Хочу приклад из ореха на АК-74',
  website: '',
};

let ipCounter = 0;
function request(body: unknown) {
  return new Request('http://localhost/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.1.${++ipCounter}` },
    body: JSON.stringify(body),
  });
}

let consoleError: jest.SpyInstance;

beforeEach(() => {
  afterCallbacks.length = 0;
  notifyOwnerMock.mockResolvedValue({ telegram: 'failed', vk: 'ok', email: 'ok' });
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
});

describe('POST /api/feedback', () => {
  it('сохраняет обращение, отвечает 201 и уведомляет после ответа', async () => {
    saveFeedbackMock.mockResolvedValue({ ok: true, id: 'fb-1' });

    const res = await POST(request(payload));

    expect(res.status).toBe(201);
    expect(saveFeedbackMock).toHaveBeenCalledWith(expect.objectContaining({ topic: 'custom' }));
    expect(afterCallbacks).toHaveLength(1);

    await afterCallbacks[0]();

    expect(notifyOwnerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Обращение · Кастомный проект · Иван',
        link: { label: 'VK', url: 'https://vk.ru/ivan' },
      }),
    );
    expect(setFeedbackNotifications).toHaveBeenCalledWith('fb-1', {
      telegram: 'failed',
      vk: 'ok',
      email: 'ok',
    });
  });

  it('при ошибке БД отвечает 500 в формате ADR 0002', async () => {
    saveFeedbackMock.mockResolvedValue({ ok: false, error: 'connection refused' });

    const res = await POST(request(payload));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ message: 'Не удалось отправить сообщение' });
    expect(afterCallbacks).toHaveLength(0);
  });

  it('honeypot: отвечает как при успехе, но ничего не сохраняет', async () => {
    const res = await POST(request({ ...payload, website: 'spam' }));

    expect(res.status).toBe(201);
    expect(saveFeedbackMock).not.toHaveBeenCalled();
  });

  it('невалидные поля — 422 с details', async () => {
    const res = await POST(request({ ...payload, message: 'коротко' }));

    expect(res.status).toBe(422);
    await expect(res.json()).resolves.toMatchObject({ details: { message: expect.any(String) } });
    expect(saveFeedbackMock).not.toHaveBeenCalled();
  });
});
