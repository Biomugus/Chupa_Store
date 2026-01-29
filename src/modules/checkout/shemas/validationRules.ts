// src/modules/checkout/shemas/validationRules.ts

import { z } from 'zod';

export const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
export const fullNameRegex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;

export const commonValidation = {
  fullName: z
    .string()
    .trim()
    .min(5, 'Введите фамилию и имя')
    .regex(fullNameRegex, 'Используйте только буквы'),

  phone: z.string().regex(phoneRegex, 'Формат: +7 (999) 999-99-99'),

  location: z.string().min(1, 'Укажите город'),
};
