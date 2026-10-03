/**
 * @jest-environment node
 */

// src/shared/lib/__tests__/telegram.test.ts

import { sendTelegramMessage } from '../telegram';

const fetchMock = jest.fn();

beforeEach(() => {
  process.env.TG_BOT_TOKEN = 'test-token';
  process.env.TG_CHAT_ID = '42';
  global.fetch = fetchMock;
});

describe('sendTelegramMessage', () => {
  it('ограничивает запрос к Telegram таймаутом', async () => {
    fetchMock.mockResolvedValue(new Response('{"ok":true}'));

    await expect(sendTelegramMessage({ text: 'Заказ' })).resolves.toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('при недоступном Telegram возвращает failed со status 0, а не бросает', async () => {
    fetchMock.mockRejectedValue(new DOMException('The operation was aborted', 'TimeoutError'));

    await expect(sendTelegramMessage({ text: 'Заказ' })).resolves.toEqual({
      ok: false,
      reason: 'failed',
      status: 0,
      error: 'TimeoutError: The operation was aborted',
    });
  });

  it('при ответе Telegram с ошибкой возвращает его статус и текст', async () => {
    fetchMock.mockResolvedValue(new Response('Bad Request', { status: 400 }));

    await expect(sendTelegramMessage({ text: 'Заказ' })).resolves.toEqual({
      ok: false,
      reason: 'failed',
      status: 400,
      error: 'Bad Request',
    });
  });
});
