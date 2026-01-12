import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';

import { CartItem } from '../types/CartItem';

export async function fetchCart(): Promise<CartItem[]> {
  return httpClient<CartItem[]>(endpoints.cart);
}

export async function addToCart(item: CartItem): Promise<CartItem[]> {
  return httpClient<CartItem[]>(endpoints.cart, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function removeFromCart(id: string): Promise<CartItem[]> {
  return httpClient<CartItem[]>(`${endpoints.cart}/${id}`, { method: 'DELETE' });
}
