// src/modules/checkout/containers/__tests__/CheckoutFormContainer.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import { useCitySuggestions } from '../../hooks/useCitySuggestions';
import sendOrder from '../../services/sendOrder';
import {
  CheckoutFormData,
  ContactMethod,
  DeliveryService,
  PaymentMethod,
} from '../../types/checkoutTypes';
import CheckoutFormContainer from '../CheckoutFormContainer';

jest.mock('../../services/sendOrder', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Город выбирается только из подсказок DaData — подменяем форму уже заполненной.
jest.mock('../../hooks/useCheckoutForm', () => ({ useCheckoutForm: jest.fn() }));
jest.mock('../../hooks/useCitySuggestions', () => ({ useCitySuggestions: jest.fn() }));

const sendOrderMock = sendOrder as jest.MockedFunction<typeof sendOrder>;
const useCheckoutFormMock = useCheckoutForm as jest.MockedFunction<typeof useCheckoutForm>;
const useCitySuggestionsMock = useCitySuggestions as jest.MockedFunction<typeof useCitySuggestions>;

const validValues: CheckoutFormData = {
  location: 'г Москва',
  paymentMethod: PaymentMethod.CARD_TRANSFER,
  deliveryService: DeliveryService.CDEK,
  fullName: 'Иванов Иван',
  phone: '+7 (999) 000-00-00',
  contactMethod: ContactMethod.TELEGRAM,
  contactValue: '@ivan_petrov',
  website: '',
};

beforeEach(() => {
  useCheckoutFormMock.mockReturnValue({
    values: validValues,
    errors: {},
    setErrors: jest.fn(),
    isValid: true,
    handleChange: jest.fn(),
    handleSubmit: (onValid) => onValid(validValues),
    reset: jest.fn(),
  });
  useCitySuggestionsMock.mockReturnValue({ suggestions: [], isLoading: false });
});

function renderContainer() {
  render(
    <CheckoutFormContainer
      cartSnapshot={{ items: [{ id: '1', title: 'Цевьё', price: 3500, quantity: 1 }], total: 3500 }}
      onOpenSuccessModal={jest.fn()}
    />,
  );
}

describe('CheckoutFormContainer', () => {
  it('во время отправки показывает спиннер и блокирует кнопку', async () => {
    sendOrderMock.mockReturnValue(new Promise(() => {}));
    renderContainer();

    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    const button = await screen.findByRole('button', { name: /Отправка/ });
    expect(button).toBeDisabled();
  });

  it('загрузка подсказок городов не блокирует отправку заказа', () => {
    useCitySuggestionsMock.mockReturnValue({ suggestions: [], isLoading: true });
    renderContainer();

    expect(screen.getByRole('button', { name: 'Отправить' })).toBeEnabled();
  });

  it('при сетевой ошибке показывает понятное сообщение и «Повторить попытку»', async () => {
    sendOrderMock.mockRejectedValue({ status: 0, message: 'Network error' });
    renderContainer();

    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Нет соединения. Проверьте интернет и попробуйте ещё раз',
    );
    expect(screen.getByRole('button', { name: 'Повторить попытку' })).toBeEnabled();
  });
});
