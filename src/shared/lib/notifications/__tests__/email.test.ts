/**
 * @jest-environment node
 */

// src/shared/lib/notifications/__tests__/email.test.ts

import nodemailer from 'nodemailer';
import { sendEmail } from '../email';

jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));

const sendMail = jest.fn();
const createTransport = nodemailer.createTransport as jest.Mock;

beforeEach(() => {
  process.env.SMTP_HOST = 'smtp.yandex.ru';
  process.env.SMTP_PORT = '465';
  process.env.SMTP_USER = 'orders@example.ru';
  process.env.SMTP_PASS = 'app-password';
  process.env.NOTIFY_EMAIL_TO = 'a@example.ru, b@example.ru';
  createTransport.mockReturnValue({ sendMail });
});

describe('sendEmail', () => {
  it('отправляет письмо с ящика SMTP_USER на NOTIFY_EMAIL_TO', async () => {
    sendMail.mockResolvedValue({});

    await expect(
      sendEmail({
        subject: 'Заказ · Иван',
        text: 'Поступил заказ',
        link: { label: 'VK', url: 'https://vk.com/id1' },
      }),
    ).resolves.toEqual({ ok: true });

    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: 'smtp.yandex.ru', port: 465, secure: true }),
    );
    expect(sendMail).toHaveBeenCalledWith({
      from: { name: 'Chupa Workshop', address: 'orders@example.ru' },
      to: 'a@example.ru, b@example.ru',
      subject: 'Заказ · Иван',
      text: 'Поступил заказ\n\n💬 Написать в VK: https://vk.com/id1',
    });
  });

  it('при ошибке SMTP возвращает failed с кодом ответа, а не бросает', async () => {
    sendMail.mockRejectedValue(Object.assign(new Error('Invalid login'), { responseCode: 535 }));

    await expect(sendEmail({ subject: 'Заказ', text: 'Заказ' })).resolves.toEqual({
      ok: false,
      reason: 'failed',
      status: 535,
      error: 'Error: Invalid login',
    });
  });

  it('без SMTP-настроек канал выключен', async () => {
    delete process.env.SMTP_PASS;

    await expect(sendEmail({ subject: 'Заказ', text: 'Заказ' })).resolves.toEqual({
      ok: false,
      reason: 'misconfigured',
    });
    expect(createTransport).not.toHaveBeenCalled();
  });
});
