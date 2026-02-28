// src/modules/cart/__tests__/test-utils.tsx
// Хелпер для integration-тестов: рендерит компонент с реальным Redux store

import { AppStore, makeStore } from '@/lib/store';
import { addItem } from '@/modules/cart/store/cartSlice';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { CartItem } from '../types/CartItem';

type RenderWithStoreOptions = {
  preloadedItems?: CartItem[];
  renderOptions?: Omit<RenderOptions, 'wrapper'>;
};

/**
 * Рендерит компонент внутри реального Redux Provider.
 * Можно передать preloadedItems — они будут добавлены в store до рендера.
 * Возвращает всё что даёт RTL render() + ссылку на store.
 */
export function renderWithStore(
  ui: React.ReactElement,
  { preloadedItems = [], renderOptions }: RenderWithStoreOptions = {},
) {
  const store: AppStore = makeStore();

  // Наполняем store товарами через dispatch (как в реальном приложении)
  preloadedItems.forEach((item) => store.dispatch(addItem(item)));

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/** Фабрика тестовых товаров */
export const mockItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item-1',
  title: 'Цевьё Зенит',
  price: 3500,
  quantity: 1,
  image: '/images/test.jpg',
  ...overrides,
});
