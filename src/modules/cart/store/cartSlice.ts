// src/modules/cart/store/cartSlice.ts

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadCart, saveCart } from '../dal/cartStorage';
import { CartItem } from '../types/CartItem';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCart(),
};

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

export const { addItem, changeQuantity, removeItem, clearCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);
export const cartReducer = cartSlice.reducer;
