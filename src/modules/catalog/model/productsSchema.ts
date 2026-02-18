// src/modules/catalog/model/productsShema.ts

import { Database } from '@/types/supabase';
import { z } from 'zod';

export type ProductRow = Database['public']['Tables']['products']['Row'];

export const ProductsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  price: z.number(),
  slug: z.string(),
  category: z.string().nullable(),
  model: z.string().nullable(),
  material: z.string().nullable(),
  productType: z.string().nullable(),
  images: z.array(z.string()).default([]),
  description: z.string().nullable(),
  characteristics: z.string().nullable(),
  compatibility: z.string().nullable(),
});

export type Product = z.infer<typeof ProductsSchema>;

/**
 * Маппер: превращает плоский объект из БД в типизированный объект для фронтенда.
 * Это решает конфликт имен полей (product_type -> productType).
 */
export const mapDbProduct = (row: ProductRow): Product => {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    slug: row.slug,
    category: row.category,
    model: row.model,
    material: row.material,
    productType: row.product_type,
    images: row.images ?? [],
    description: row.description,
    characteristics: row.characteristics,
    compatibility: row.compatibility,
  };
};

export const catalogSearchParamsSchema = ProductsSchema.pick({
  model: true,
  productType: true,
  material: true,
})
  .extend({
    query: z.string().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  })
  .partial();

export type CatalogSearchParams = z.infer<typeof catalogSearchParamsSchema>;
