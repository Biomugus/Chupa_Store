// src/modules/catalog/api/getCatalog.ts

import { Product, ProductsSchema } from '@/app/api/products/productsShema';
import fs from 'fs/promises';
import path from 'path';

export async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'src/data/products.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw);
  return ProductsSchema.parse(data);
}
