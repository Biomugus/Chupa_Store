// src/modules/contacts/containers/__tests__/ContactFormContainer.test.tsx

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import sendFeedback from '../../services/sendFeedback';
import ContactFormContainer from '../ContactFormContainer';

jest.mock('../../services/sendFeedback', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const sendFeedbackMock = sendFeedback as jest.MockedFunction<typeof sendFeedback>;

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Ваше имя'), { target: { value: 'Иван' } });
  fireEvent.change(screen.getByLabelText('Как с вами связаться'), {
    target: { value: '@ivan_petrov' },
  });
  fireEvent.change(screen.getByLabelText('Сообщение'), {
    target: { value: 'Подойдёт ли цевьё на АК-74?' },
  });
}

describe('ContactFormContainer', () => {
  it('при пустой отправке показывает ошибки и фокусирует первое поле', async () => {
    render(<ContactFormContainer initialTopic="question" />);

    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(screen.getByText('Как к вам обращаться?')).toBeInTheDocument();
    expect(screen.getByText('Оставьте контакт для ответа')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Ваше имя')).toHaveFocus());
    expect(sendFeedbackMock).not.toHaveBeenCalled();
  });

  it('подставляет тему из initialTopic', () => {
    render(<ContactFormContainer initialTopic="partnership" />);

    expect(screen.getByLabelText('Тема обращения')).toHaveTextContent('Сотрудничество');
  });

  it('подсказка в поле сообщения соответствует теме', () => {
    render(<ContactFormContainer initialTopic="defect" />);

    expect(screen.getByLabelText('Сообщение')).toHaveAttribute(
      'placeholder',
      expect.stringContaining('в чём проблема'),
    );
  });

  it('показывает экран благодарности после успешной отправки', async () => {
    sendFeedbackMock.mockResolvedValueOnce({ status: 'ok' });
    render(<ContactFormContainer initialTopic="custom" />);

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Спасибо! Сообщение отправлено')).toBeInTheDocument();
    expect(sendFeedbackMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Иван', contact: '@ivan_petrov', topic: 'custom' }),
    );
  });

  it('при ошибке сервера предлагает повторить и написать в мессенджер', async () => {
    sendFeedbackMock.mockRejectedValueOnce({ status: 502, message: 'Не удалось отправить' });
    render(<ContactFormContainer initialTopic="question" />);

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Не удалось отправить')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Повторить попытку' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Telegram' })).toHaveAttribute(
      'href',
      'https://t.me/chupa_workshop',
    );
  });

  it('раскладывает ошибки валидации сервера по полям', async () => {
    sendFeedbackMock.mockRejectedValueOnce({
      status: 422,
      message: 'Проверьте заполнение формы',
      details: { contact: 'Некорректный контакт' },
    });
    render(<ContactFormContainer initialTopic="question" />);

    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByText('Некорректный контакт')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Повторить попытку' })).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Как с вами связаться')).toHaveFocus());
  });
});
