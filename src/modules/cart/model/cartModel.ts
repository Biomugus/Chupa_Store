// cart/model/cartModel.ts

import { makeAutoObservable } from 'mobx';
import { CartItem } from '../types/CartItem';

export class CartModel {
  items: CartItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item: CartItem) {
    const existing = this.items.find((i) => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
      return;
    }

    this.items.push(item);
  }

  changeQuantity(id: string, delta: 1 | -1) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    const next = item.quantity + delta;

    if (next <= 0) {
      this.removeItem(id);
      return;
    }

    item.quantity = next;
  }

  removeItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  clear() {
    this.items = [];
  }

  get total() {
    return this.items.reduce((s, i) => s + i.price * i.quantity, 0);
  }
}
