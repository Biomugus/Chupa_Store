// cart/model/cartModel.ts

import { makeAutoObservable } from 'mobx';
import { CartItem } from '../types/CartItem';

export class CartModel {
  items: CartItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item: CartItem) {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      this.items[index].quantity += item.quantity;
    } else {
      this.items.push(item);
    }
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
