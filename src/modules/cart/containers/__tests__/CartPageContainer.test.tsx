// src/modules/cart/containers/__tests__/CartPageContainer.test.tsx

import { fireEvent, screen } from '@testing-library/react';
import { mockItem, renderWithStore } from '../../testing/test-utils';
import { CartPageContainer } from '../CartPageContainer';

jest.mock('../../dal/cartStorage', () => ({
  loadCart: () => [],
  saveCart: jest.fn(),
}));

jest.mock('../../../../shared/hooks/useIsGuest', () => ({
  useIsGuest: () => true,
}));

jest.mock('../../../../shared/ui/modal/Modal', () => {
  return function MockModal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
    return isOpen ? <div data-testid="mock-modal">{children}</div> : null;
  };
});

describe('CartPageContainer — integration', () => {
  it('показывает пустую корзину если нет товаров', () => {
    renderWithStore(<CartPageContainer />);

    expect(screen.getByText(/корзина пуста/i)).toBeInTheDocument();
  });

  it('отображает названия товаров из store', () => {
    renderWithStore(<CartPageContainer />, {
      preloadedItems: [
        mockItem({ id: '1', title: 'Цевьё Зенит' }),
        mockItem({ id: '2', title: 'Рукоятка Зенит' }),
      ],
    });

    expect(screen.getByText('Цевьё Зенит')).toBeInTheDocument();
    expect(screen.getByText('Рукоятка Зенит')).toBeInTheDocument();
  });

  it('отображает итоговую сумму', () => {
    renderWithStore(<CartPageContainer />, {
      preloadedItems: [
        mockItem({ id: '1', price: 3500, quantity: 2 }), // 7 000
        mockItem({ id: '2', price: 1500, quantity: 1 }), // 1 500
      ],
    });

    // formatPrice(8500) → "8 500,00 ₽" (Intl, ru-RU)
    expect(screen.getByText(/8[\s\u00a0]500/)).toBeInTheDocument();
  });

  it('увеличивает количество при клике «+»', () => {
    renderWithStore(<CartPageContainer />, {
      preloadedItems: [mockItem({ id: '1', title: 'Цевьё', quantity: 1, price: 1000 })],
    });

    expect(screen.getByText('x1')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Добавить количество'));

    expect(screen.getByText('x2')).toBeInTheDocument();
  });

  it('удаляет товар при уменьшении количества до 0', () => {
    renderWithStore(<CartPageContainer />, {
      preloadedItems: [mockItem({ id: '1', title: 'Цевьё', quantity: 1 })],
    });

    expect(screen.getByText('Цевьё')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Уменьшить количество'));

    expect(screen.queryByText('Цевьё')).not.toBeInTheDocument();
    expect(screen.getByText(/корзина пуста/i)).toBeInTheDocument();
  });
});
