// src/modules/cart/store/__tests__/cartSlice.test.ts

import { CartItem } from '../../types/CartItem';
import {
  addItem,
  cartReducer,
  changeQuantity,
  clearCart,
  removeItem,
  selectCartTotal,
} from '../cartSlice';

// Мокаем localStorage — в тестовой среде его нет
jest.mock('../../dal/cartStorage', () => ({
  loadCart: () => [],
  saveCart: jest.fn(),
}));

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  title: 'Цевьё Зенит',
  price: 3500,
  quantity: 1,
  image: '/images/test.jpg',
  ...overrides,
});

const emptyState = { items: [] as CartItem[], loading: false };

describe('cartSlice', () => {
  // ── addItem ──────────────────────────────────────

  describe('addItem', () => {
    it('добавляет новый товар в пустую корзину', () => {
      const item = makeItem();
      const state = cartReducer(emptyState, addItem(item));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toMatchObject({ id: 'item-1', title: 'Цевьё Зенит', quantity: 1 });
    });

    it('увеличивает quantity при добавлении существующего товара', () => {
      const initial = { ...emptyState, items: [makeItem({ quantity: 2 })] };
      const state = cartReducer(initial, addItem(makeItem({ quantity: 3 })));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('не создаёт дубликат при повторном добавлении', () => {
      const initial = { ...emptyState, items: [makeItem()] };
      const state = cartReducer(initial, addItem(makeItem()));

      expect(state.items).toHaveLength(1);
    });
  });

  // ── changeQuantity ───────────────────────────────

  describe('changeQuantity', () => {
    it('увеличивает количество на +1', () => {
      const initial = { ...emptyState, items: [makeItem({ quantity: 2 })] };
      const state = cartReducer(initial, changeQuantity({ id: 'item-1', delta: 1 }));

      expect(state.items[0].quantity).toBe(3);
    });

    it('уменьшает количество на -1', () => {
      const initial = { ...emptyState, items: [makeItem({ quantity: 3 })] };
      const state = cartReducer(initial, changeQuantity({ id: 'item-1', delta: -1 }));

      expect(state.items[0].quantity).toBe(2);
    });

    it('удаляет товар когда quantity становится 0', () => {
      const initial = { ...emptyState, items: [makeItem({ quantity: 1 })] };
      const state = cartReducer(initial, changeQuantity({ id: 'item-1', delta: -1 }));

      expect(state.items).toHaveLength(0);
    });

    it('игнорирует несуществующий id', () => {
      const initial = { ...emptyState, items: [makeItem()] };
      const state = cartReducer(initial, changeQuantity({ id: 'no-such-item', delta: 1 }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(1);
    });
  });

  // ── removeItem ───────────────────────────────────

  describe('removeItem', () => {
    it('удаляет товар по id', () => {
      const initial = {
        ...emptyState,
        items: [makeItem({ id: 'a' }), makeItem({ id: 'b' })],
      };
      const state = cartReducer(initial, removeItem('a'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('b');
    });

    it('не ломается при удалении несуществующего id', () => {
      const initial = { ...emptyState, items: [makeItem()] };
      const state = cartReducer(initial, removeItem('no-such-item'));

      expect(state.items).toHaveLength(1);
    });
  });

  // ── clearCart ─────────────────────────────────────

  describe('clearCart', () => {
    it('очищает всю корзину', () => {
      const initial = {
        ...emptyState,
        items: [makeItem({ id: 'a' }), makeItem({ id: 'b' }), makeItem({ id: 'c' })],
      };
      const state = cartReducer(initial, clearCart());

      expect(state.items).toHaveLength(0);
    });
  });

  // ── selectCartTotal ──────────────────────────────

  describe('selectCartTotal', () => {
    it('считает total = сумма (price × quantity)', () => {
      const state = {
        cart: {
          ...emptyState,
          items: [
            makeItem({ price: 1000, quantity: 2 }), // 2000
            makeItem({ id: 'item-2', price: 500, quantity: 3 }), // 1500
          ],
        },
      };

      expect(selectCartTotal(state)).toBe(3500);
    });

    it('возвращает 0 для пустой корзины', () => {
      const state = { cart: emptyState };

      expect(selectCartTotal(state)).toBe(0);
    });
  });
});
