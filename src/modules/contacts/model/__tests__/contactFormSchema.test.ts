// src/modules/contacts/model/__tests__/contactFormSchema.test.ts

import { contactFormSchema, isValidContact } from '../contactFormSchema';
import { parseTopic } from '../contactTopics';

const validData = {
  name: 'Иван',
  contact: '@ivan_petrov',
  topic: 'question',
  message: 'Подойдёт ли цевьё на АК-74?',
  website: '',
};

describe('contactFormSchema', () => {
  it('пропускает корректные данные', () => {
    expect(contactFormSchema.safeParse(validData).success).toBe(true);
  });

  it('обрезает пробелы по краям', () => {
    const result = contactFormSchema.parse({ ...validData, name: '  Иван  ' });
    expect(result.name).toBe('Иван');
  });

  it.each([
    ['name', ''],
    ['contact', 'просто текст'],
    ['topic', 'unknown'],
    ['message', 'коротко'],
    ['message', 'а'.repeat(2001)],
  ])('отклоняет некорректное поле %s', (field, value) => {
    const result = contactFormSchema.safeParse({ ...validData, [field]: value });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe(field);
  });
});

describe('isValidContact', () => {
  it.each([
    '+7 999 710-11-48',
    '89997101148',
    '+7 (999) 710-11-48',
    '@chupa_workshop',
    'master@example.ru',
    't.me/chupa_workshop',
    'https://vk.com/id123',
  ])('принимает %s', (value) => {
    expect(isValidContact(value)).toBe(true);
  });

  it.each(['12345', '@abc', 'master@', 'Иван Петров', 'https://example.com/me'])(
    'отклоняет %s',
    (value) => {
      expect(isValidContact(value)).toBe(false);
    },
  );
});

describe('parseTopic', () => {
  it('возвращает известную тему', () => {
    expect(parseTopic('partnership')).toBe('partnership');
  });

  it.each([undefined, '', 'hack', ['custom']])('возвращает тему по умолчанию для %p', (raw) => {
    expect(parseTopic(raw)).toBe('question');
  });
});
