// src/modules/catalog/api/getCatalog.ts

import { Product, ProductsSchema } from '@/app/api/products/productsShema';
import fs from 'fs/promises';
import path from 'path';

export interface CatalogSearchParams {
  model?: string;
  productType?: string;
  material?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function getProducts(params?: CatalogSearchParams): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw);
  let products = ProductsSchema.parse(data);

  if (params) {
    if (params.model) products = products.filter((p) => p.slug.includes(params.model!));
    if (params.minPrice) products = products.filter((p) => p.price >= Number(params.minPrice));
    if (params.maxPrice) products = products.filter((p) => p.price <= Number(params.maxPrice));
  }

  return products;
}
