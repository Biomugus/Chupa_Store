// app/api/products/schema.ts

import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().positive(),
  slug: z.string(),
  images: z.array(z.string()),
  content: z.object({
    description: z.string().min(10),
    characteristics: z.string().min(10),
    compatibility: z.string().min(10),
  }),
});

export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
