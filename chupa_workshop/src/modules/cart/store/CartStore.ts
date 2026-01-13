//cart/store/CartStore.ts

import { makeAutoObservable } from 'mobx';
import { loadCart, saveCart } from '../dal/cartStorage';
import { CartModel } from '../model/cartModel';
import { CartItem } from '../types/CartItem';

class CartStore {
  model = new CartModel();
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  load() {
    const items = loadCart();
    this.model.items = items;
  }

  addItem(item: CartItem) {
    this.model.addItem(item);
    saveCart(this.model.items);
  }

  removeItem(id: string) {
    this.model.removeItem(id);
    saveCart(this.model.items);
  }

  clear() {
    this.model.clear();
    saveCart(this.model.items);
  }

  get items() {
    return this.model.items;
  }

  get total() {
    return this.model.total;
  }
}

export const cartStore = new CartStore();
