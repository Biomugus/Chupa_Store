import { makeAutoObservable, runInAction } from 'mobx';
import { fetchCart } from '../api/cartApi';
import { CartItem } from '../types/CartItem';

class CartStore {
  items: CartItem[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
  }

  // --- Persistence ---
  loadFromStorage() {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem('cart');
    if (data) this.items = JSON.parse(data);
  }

  saveToStorage() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  // --- Actions ---
  addItem(item: CartItem) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index > -1) {
      this.items[index].quantity += item.quantity;
    } else {
      this.items.push(item);
    }
    this.saveToStorage();
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
    this.saveToStorage();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  // --- Computed ---
  get total() {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  // --- Async API examples ---
  async fetchCartFromServer() {
    this.loading = true;
    try {
      const data = await fetchCart();
      runInAction(() => {
        this.items = data ?? [];
        this.saveToStorage();
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const cartStore = new CartStore();
