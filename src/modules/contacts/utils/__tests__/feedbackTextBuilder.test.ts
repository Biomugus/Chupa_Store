// src/modules/contacts/utils/__tests__/feedbackTextBuilder.test.ts

import { buildFeedbackData, getContactLink } from '../feedbackTextBuilder';

describe('buildFeedbackData', () => {
  it('собирает текст с темой, именем, контактом и сообщением', () => {
    const { text } = buildFeedbackData({
      name: 'Иван',
      contact: '+7 999 000-00-00',
      topic: 'custom',
      message: 'Хочу приклад из ореха',
    });

    expect(text).toContain('ОБРАЩЕНИЕ С САЙТА · Кастомный проект');
    expect(text).toContain('Имя: Иван');
    expect(text).toContain('Контакт: +7 999 000-00-00');
    expect(text).toContain('Хочу приклад из ореха');
  });
});

describe('getContactLink', () => {
  it('делает ссылку на Telegram из @username', () => {
    expect(getContactLink('@ivan_petrov')).toEqual({
      url: 'https://t.me/ivan_petrov',
      label: 'Telegram',
    });
  });

  it('нормализует ссылки на vk.ru и мобильный m.vk.com', () => {
    expect(getContactLink('https://vk.ru/chupaold')).toEqual({
      url: 'https://vk.ru/chupaold',
      label: 'VK',
    });
    expect(getContactLink('m.vk.com/chupaold')).toEqual({
      url: 'https://m.vk.com/chupaold',
      label: 'VK',
    });
  });

  it('нормализует ссылки на t.me и vk.com', () => {
    expect(getContactLink('t.me/ivan_petrov')?.url).toBe('https://t.me/ivan_petrov');
    expect(getContactLink('http://VK.com/id123')).toEqual({
      url: 'https://vk.com/id123',
      label: 'VK',
    });
  });

  it('не делает ссылку для телефона и email', () => {
    expect(getContactLink('+7 999 000-00-00')).toBeNull();
    expect(getContactLink('ivan@example.ru')).toBeNull();
  });
});
