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

export const orderPayloadSchema = z.object({
  clientRequestId: z.string(),

  customer: z.object({
    fullName: z.string(),
    phone: z.string(),
    contactMethod: z.enum(Object.values(ContactMethod)),
    contactValue: z.string(),
    location: z.string(),
  }),

  delivery: z.object({
    service: z.enum(Object.values(DeliveryService)),
  }),

  payment: z.object({
    method: z.enum(Object.values(PaymentMethod)),
  }),

  items: z.array(orderItemSchema),
  total: z.number(),
});

export type OrderPayloadSchema = z.infer<typeof orderPayloadSchema>;
