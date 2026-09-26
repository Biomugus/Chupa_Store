// src/modules/contacts/model/contactTopics.ts

import type { ContactTopic } from '../types/contactTypes';

export const CONTACT_TOPIC_VALUES = [
  'question',
  'order',
  'custom',
  'partnership',
  'defect',
  'other',
] as const satisfies readonly ContactTopic[];

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  question: 'Вопрос по товару или подбору',
  order: 'Вопрос по заказу',
  custom: 'Кастомный проект',
  partnership: 'Сотрудничество',
  defect: 'Сообщить о браке',
  other: 'Другое',
};

/**
 * Подсказки в поле «Сообщение» под выбранную тему — чтобы сразу было понятно,
 * какие детали нужны для ответа. Номер заказа пользователю не показывается,
 * поэтому просим дату и изделие.
 */
export const CONTACT_TOPIC_PLACEHOLDERS: Record<ContactTopic, string> = {
  question: 'Например: подойдёт ли цевьё на АК-74М? Какую породу дерева посоветуете для приклада?',
  order: 'Когда оформляли заказ и что заказывали? Опишите вопрос: сроки, оплата, доставка…',
  custom:
    'Опишите идею: платформа (АК, AR…), какое изделие нужно, пожелания по породе дерева, внешнему виду и декоративной резьбе, желаемые сроки',
  partnership:
    'Расскажите о себе: магазин, стрелковый клуб или мастерская, город и какой формат сотрудничества интересен',
  defect:
    'Какое изделие и когда заказывали? Опишите, в чём проблема и когда она появилась – фото сможете прислать в мессенджере',
  other: 'Напишите, чем мы можем помочь',
};

export const DEFAULT_CONTACT_TOPIC: ContactTopic = 'question';

/** Приводит значение из `?topic=` к известной теме, иначе — тема по умолчанию. */
export function parseTopic(raw: unknown): ContactTopic {
  return typeof raw === 'string' && (CONTACT_TOPIC_VALUES as readonly string[]).includes(raw)
    ? (raw as ContactTopic)
    : DEFAULT_CONTACT_TOPIC;
}
