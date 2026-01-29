// app/api/products/route.ts

import { getProducts } from '@/modules/catalog/api/getCatalog';
import { NextResponse } from 'next/server';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
