// src/modules/cart/store/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadCart, saveCart } from '../dal/cartStorage';
import { CartItem } from '../types/CartItem';

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: loadCart(),
  loading: false,
};

/**
 * Сохраняет items в localStorage после каждого изменения.
 * Вызывается в конце каждого reducer'а, изменяющего items.
 */
function persist(items: CartItem[]) {
  saveCart(items);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      persist(state.items);
    },

    changeQuantity(state, action: PayloadAction<{ id: string; delta: 1 | -1 }>) {
      const { id, delta } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;

      const next = item.quantity + delta;

      if (next <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.quantity = next;
      }

      persist(state.items);
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      persist(state.items);
    },

    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

// Actions
export const { addItem, changeQuantity, removeItem, clearCart } = cartSlice.actions;

// Selectors (используем локальный тип чтобы избежать circular dependency с store.ts)
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

// Reducer
export const cartReducer = cartSlice.reducer;
