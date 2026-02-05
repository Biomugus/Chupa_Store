// app/api/products/route.ts

import { CatalogSearchParams, getProducts } from '@/modules/catalog/api/getCatalog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params: CatalogSearchParams = Object.fromEntries(searchParams.entries());

  const products = await getProducts(params);
  return NextResponse.json(products);
}
