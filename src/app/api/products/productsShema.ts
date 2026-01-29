// app/api/products/schema.ts

import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().positive(),
  slug: z.string(),
  images: z.array(z.string()),
  description: z.string(),
  characteristics: z.string(),
  compatibility: z.string(),
});

export const ProductsSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
