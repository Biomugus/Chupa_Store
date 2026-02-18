// src/modules/catalog/api/getProduct.ts

import { createClient } from '@/shared/api/supabase/server';
import { Product, mapDbProduct } from '../model/productsSchema';

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (error || !data) {
    console.error('Product fetch error:', error);
    return null;
  }

  return mapDbProduct(data);
}
