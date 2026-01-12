import { CartItem } from '../types/CartItem';

const CART_KEY = 'cart_items';
const USE_MOCK = true; // пока true — используем localStorage/моки, потом false → fetch на backend

function getCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// ------------------------- API -----------------------------

export async function fetchCart(): Promise<CartItem[]> {
  if (USE_MOCK) {
    return getCartFromStorage();
  } else {
    // Позже сюда можно вставить реальный fetch
    // const response = await fetch('/api/cart');
    // if (!response.ok) return [];
    // return response.json() as Promise<CartItem[]>;
    return []; // заглушка пока backend нет
  }
}

export async function addToCart(item: CartItem): Promise<CartItem[]> {
  if (USE_MOCK) {
    const current = getCartFromStorage();
    const index = current.findIndex(i => i.id === item.id);
    if (index >= 0) {
      current[index].quantity += item.quantity;
    } else {
      current.push(item);
    }
    saveCartToStorage(current);
    return current;
  } else {
    // fetch POST /api/cart
    return [];
  }
}

export async function removeFromCart(id: string): Promise<CartItem[]> {
  if (USE_MOCK) {
    const current = getCartFromStorage();
    const filtered = current.filter(i => i.id !== id);
    saveCartToStorage(filtered);
    return filtered;
  } else {
    // fetch DELETE /api/cart/:id
    return [];
  }
}
