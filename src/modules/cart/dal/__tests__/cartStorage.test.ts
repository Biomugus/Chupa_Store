// src/modules/cart/dal/__tests__/cartStorage.test.ts

import { loadCart, saveCart } from '../cartStorage';

// localStorage доступен в jsdom (jest testEnvironment)

const CART_KEY = 'cart_items';

beforeEach(() => {
  localStorage.clear();
});

describe('cartStorage', () => {
  describe('loadCart', () => {
    it('возвращает [] если localStorage пуст', () => {
      expect(loadCart()).toEqual([]);
    });

    it('парсит сохранённые данные', () => {
      const items = [{ id: '1', title: 'Test', price: 100, quantity: 2, image: '/img.jpg' }];
      localStorage.setItem(CART_KEY, JSON.stringify(items));

      expect(loadCart()).toEqual(items);
    });

    it('возвращает [] при битых данных в localStorage', () => {
      localStorage.setItem(CART_KEY, 'это не JSON!!!');

      expect(loadCart()).toEqual([]);
    });

    it('возвращает [] если в localStorage не массив', () => {
      localStorage.setItem(CART_KEY, JSON.stringify({ not: 'an array' }));

      expect(loadCart()).toEqual([]);
    });
  });

  describe('saveCart', () => {
    it('записывает JSON в localStorage', () => {
      const items = [{ id: '1', title: 'Test', price: 100, quantity: 1, image: '/img.jpg' }];
      saveCart(items as any);

      const stored = localStorage.getItem(CART_KEY);
      expect(stored).toBe(JSON.stringify(items));
    });
  });
});
