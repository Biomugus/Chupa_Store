// src/app/api/orders/payloadSchema.ts

import { commonValidation } from '@/modules/checkout/shemas/validationRules';
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
        return /vk\.com\/[\w.]+/.test(data.contactValue);
      }
      return true;
    },
    {
      message: 'Некорректный формат контакта',
      path: ['contactValue'],
    },
  );

export const orderPayloadSchema = z.object({
  clientRequestId: z.string(),
  customer: customerSchema,
  delivery: z.object({
    service: z.nativeEnum(DeliveryService),
  }),
  payment: z.object({
    method: z.nativeEnum(PaymentMethod),
  }),
  items: z.array(orderItemSchema),
  total: z.number(),
});

export type OrderPayloadSchema = z.infer<typeof orderPayloadSchema>;
