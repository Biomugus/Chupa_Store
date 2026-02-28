// src/modules/catalog/components/ProductCard/__tests__/AddToCartButton.test.tsx

import { renderWithStore } from '@/modules/cart/testing/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { Product } from '../../../model/productsSchema';
import { AddToCartButton } from '../AddToCartButton';

// Мокаем cartStorage — используем путь от cartSlice
jest.mock('../../../../cart/dal/cartStorage', () => ({
  loadCart: () => [],
  saveCart: jest.fn(),
}));

const mockProduct: Product = {
  id: 'prod-1',
  title: 'Рукоятка Зенит',
  price: 2500,
  slug: 'rukoyatka-zenit',
  category: null,
  model: null,
  material: null,
  productType: null,
  images: ['/images/rukoyatka.jpg'],
  description: null,
  characteristics: null,
  compatibility: null,
};

describe('AddToCartButton — integration', () => {
  it('отображает кнопку «В корзину»', () => {
    renderWithStore(<AddToCartButton product={mockProduct} />);

    expect(screen.getByText('В корзину')).toBeInTheDocument();
  });

  it('добавляет товар в store при клике', () => {
    const { store } = renderWithStore(<AddToCartButton product={mockProduct} />);

    fireEvent.click(screen.getByText('В корзину'));

    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: 'prod-1',
      title: 'Рукоятка Зенит',
      price: 2500,
      quantity: 1,
    });
  });

  it('увеличивает quantity при повторном клике, не создавая дубликат', () => {
    const { store } = renderWithStore(<AddToCartButton product={mockProduct} />);

    fireEvent.click(screen.getByText('В корзину'));
    fireEvent.click(screen.getByText('В корзину'));

    const items = store.getState().cart.items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });
});
