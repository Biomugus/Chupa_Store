// src/modules/checkout/schemas/checkoutSchema.ts

import { z } from 'zod';
import { ContactMethod, DeliveryService, PaymentMethod } from '../types/checkoutTypes';
import { commonValidation } from './validationRules';

export const checkoutSchema = z
  .object({
    fullName: commonValidation.fullName,
    phone: commonValidation.phone,
    location: commonValidation.location,
    paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]]),
    deliveryService: z.enum(Object.values(DeliveryService) as [string, ...string[]]),
    contactMethod: z.enum(Object.values(ContactMethod) as [string, ...string[]]),
    contactValue: z.string().min(2, 'Обязательное поле'),
  })
  .superRefine((data, ctx) => {
    if (data.contactMethod === ContactMethod.TELEGRAM) {
      if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(data.contactValue)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Некорректный ник Telegram (5-32 символа)',
          path: ['contactValue'],
        });
      }
    }

    if (data.contactMethod === ContactMethod.VK) {
      if (!/vk\.com\/[\w.]+/.test(data.contactValue)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Введите ссылку на профиль VK (vk.com/...)',
          path: ['contactValue'],
        });
      }
    }
  });
