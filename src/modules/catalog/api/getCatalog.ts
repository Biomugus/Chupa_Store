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
    products = products.filter((p) => {
      const matchModel = !params.model || p.model === params.model;
      const matchType = !params.productType || p.productType === params.productType;
      const matchMaterial = !params.material || p.material === params.material;
      const matchMinPrice = !params.minPrice || p.price >= Number(params.minPrice);
      const matchMaxPrice = !params.maxPrice || p.price <= Number(params.maxPrice);

      return matchModel && matchType && matchMaterial && matchMinPrice && matchMaxPrice;
    });
  }

  return products;
}
