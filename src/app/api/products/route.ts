// app/api/products/route.ts
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { ProductsSchema } from './productsShema';

const filePath = path.join(process.cwd(), 'src/data/products.json');

export async function GET() {
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const products = ProductsSchema.parse(data);
  return NextResponse.json(products);
}
