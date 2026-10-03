/**
 * @jest-environment node
 */

// src/shared/lib/notifications/__tests__/notifyOwner.test.ts

import { sendEmail } from '../email';
import { notifyOwner } from '../index';
import { sendTelegramMessage } from '../telegram';
import { sendVkMessage } from '../vk';

jest.mock('../telegram', () => ({ sendTelegramMessage: jest.fn() }));
jest.mock('../vk', () => ({ sendVkMessage: jest.fn() }));
jest.mock('../email', () => ({ sendEmail: jest.fn() }));

const telegram = sendTelegramMessage as jest.Mock;
const vk = sendVkMessage as jest.Mock;
const email = sendEmail as jest.Mock;

const notification = { subject: 'Заказ', text: 'Поступил заказ' };

let consoleError: jest.SpyInstance;

beforeEach(() => {
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
});

describe('notifyOwner', () => {
  it('шлёт во все каналы и собирает итог по каждому', async () => {
    telegram.mockResolvedValue({ ok: false, reason: 'failed', status: 0, error: 'blocked' });
    vk.mockResolvedValue({ ok: true });
    email.mockResolvedValue({ ok: false, reason: 'misconfigured' });

    await expect(notifyOwner(notification)).resolves.toEqual({
      telegram: 'failed',
      vk: 'ok',
      email: 'skipped',
    });

    expect(telegram).toHaveBeenCalledWith(notification);
    expect(vk).toHaveBeenCalledWith(notification);
    expect(email).toHaveBeenCalledWith(notification);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to send notification via telegram',
      expect.anything(),
    );
  });

  it('исключение в канале не мешает остальным', async () => {
    telegram.mockRejectedValue(new Error('boom'));
    vk.mockResolvedValue({ ok: true });
    email.mockResolvedValue({ ok: true });

    await expect(notifyOwner(notification)).resolves.toEqual({
      telegram: 'failed',
      vk: 'ok',
      email: 'ok',
    });
  });

  it('пишет в лог, если не настроен ни один канал', async () => {
    [telegram, vk, email].forEach((channel) =>
      channel.mockResolvedValue({ ok: false, reason: 'misconfigured' }),
    );

    await notifyOwner(notification);

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('No notification channels configured'),
      expect.anything(),
    );
  });
});
