// src/app/api/orders/payloadSchema.ts

import { commonValidation, vkProfileRegex } from '@/modules/checkout/shemas/validationRules';
import {
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '@/modules/checkout/types/checkoutTypes';
import z from 'zod';

export const orderItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
});

const customerSchema = z
  .object({
    fullName: commonValidation.fullName,
    phone: commonValidation.phone,
    location: commonValidation.location,
    contactMethod: z.nativeEnum(ContactMethod),
    contactValue: z.string().min(2),
  })
  .refine(
    (data) => {
      if (data.contactMethod === ContactMethod.TELEGRAM) {
        return /^@?[a-zA-Z0-9_]{5,32}$/.test(data.contactValue);
      }
      if (data.contactMethod === ContactMethod.VK) {
        return vkProfileRegex.test(data.contactValue.trim());
      }
      return true;
    },
    {
      message: 'Некорректный формат контакта',
      path: ['contactValue'],
    },
  );

export const orderPayloadSchema = z.object({
  // uuid: колонка orders.client_request_id — UUID, по ней работает идемпотентность.
  clientRequestId: z.string().uuid(),
  customer: customerSchema,
  delivery: z.object({
    service: z.nativeEnum(DeliveryService),
  }),
  payment: z.object({
    method: z.nativeEnum(PaymentMethod),
  }),
  items: z.array(orderItemSchema),
  total: z.number(),

  // Honeypot-поле для формы чекаута: у реальных пользователей всегда пустое
  // (скрыто через CSS), боты, заполняющие все поля подряд, попадаются на нём.
  website: z.string().optional(),
});

export type OrderPayloadSchema = z.infer<typeof orderPayloadSchema>;
