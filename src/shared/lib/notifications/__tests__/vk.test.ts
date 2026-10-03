/**
 * @jest-environment node
 */

// src/shared/lib/notifications/__tests__/vk.test.ts

import { sendVkMessage } from '../vk';

const fetchMock = jest.fn();
const notification = { subject: 'Заказ', text: 'Поступил заказ' };

beforeEach(() => {
  process.env.VK_GROUP_TOKEN = 'group-token';
  process.env.VK_NOTIFY_PEER_IDS = '111, 222';
  global.fetch = fetchMock;
});

function sentParams(callIndex: number) {
  return new URLSearchParams(fetchMock.mock.calls[callIndex][1].body);
}

describe('sendVkMessage', () => {
  it('отправляет сообщение каждому получателю из VK_NOTIFY_PEER_IDS', async () => {
    fetchMock.mockImplementation(async () => Response.json({ response: 1 }));

    await expect(sendVkMessage(notification)).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(sentParams(0).get('peer_id')).toBe('111');
    expect(sentParams(1).get('peer_id')).toBe('222');
    expect(sentParams(0).get('message')).toBe('Поступил заказ');
    expect(sentParams(0).get('access_token')).toBe('group-token');
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('ошибку VK API в теле ответа с HTTP 200 считает сбоем', async () => {
    fetchMock
      .mockResolvedValueOnce(Response.json({ response: 1 }))
      .mockResolvedValueOnce(
        Response.json({ error: { error_code: 901, error_msg: "Can't send messages" } }),
      );

    await expect(sendVkMessage(notification)).resolves.toEqual({
      ok: false,
      reason: 'failed',
      status: 0,
      error: "222: 901 Can't send messages",
    });
  });

  it('при недоступном VK возвращает failed, а не бросает', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    const result = await sendVkMessage(notification);

    expect(result).toMatchObject({ ok: false, reason: 'failed' });
  });

  it('без токена или получателей канал выключен', async () => {
    process.env.VK_NOTIFY_PEER_IDS = ' ';

    await expect(sendVkMessage(notification)).resolves.toEqual({
      ok: false,
      reason: 'misconfigured',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
