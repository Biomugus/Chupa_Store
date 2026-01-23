import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductImageGallery from './ProductImageGallery';

describe('ProductImageGallery', () => {
  const defaultAlt = 'Test Product';

  describe('Базовые случаи', () => {
    it('рендерит одно изображение', () => {
      const images = ['/image1.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      expect(screen.queryByLabelText('Предыдущее изображение')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Следующее изображение')).not.toBeInTheDocument();
    });

    it('рендерит несколько изображений', () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      expect(screen.getByLabelText('Предыдущее изображение')).toBeInTheDocument();
      expect(screen.getByLabelText('Следующее изображение')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: /Перейти к изображению/ })).toHaveLength(3);
    });

    it('рендерит placeholder при пустом массиве', () => {
      render(<ProductImageGallery images={[]} alt={defaultAlt} />);
      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      expect(screen.getByTestId('image-0')).toHaveAttribute('src', '/images/placeholder.jpg');
    });
  });

  describe('Навигация через кнопки', () => {
    it('переключает на следующее изображение', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const nextButton = screen.getByLabelText('Следующее изображение');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 2`)).toBeInTheDocument();
      });

      const activeIndicator = screen.getAllByRole('button', { name: /Перейти к изображению/ })[1];
      expect(activeIndicator).toHaveAttribute('aria-current', 'true');
    });

    it('переключает на предыдущее изображение', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const prevButton = screen.getByLabelText('Предыдущее изображение');
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 3`)).toBeInTheDocument();
      });
    });

    it('циклически переключает вперед', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const nextButton = screen.getByLabelText('Следующее изображение');
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      });
    });

    it('циклически переключает назад', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const prevButton = screen.getByLabelText('Предыдущее изображение');
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 2`)).toBeInTheDocument();
      });
    });
  });

  describe('Навигация через индикаторы', () => {
    it('переключает на изображение по клику на индикатор', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const indicator3 = screen.getByLabelText('Перейти к изображению 3');
      await user.click(indicator3);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 3`)).toBeInTheDocument();
      });
      expect(indicator3).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('Клавиатурная навигация', () => {
    it('переключает на следующее изображение по ArrowRight', async () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[tabindex="0"]');
      if (gallery) fireEvent.keyDown(gallery, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 2`)).toBeInTheDocument();
      });
    });

    it('переключает на предыдущее изображение по ArrowLeft', async () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[tabindex="0"]');
      if (gallery) fireEvent.keyDown(gallery, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 3`)).toBeInTheDocument();
      });
    });

    it('не переключает при других клавишах', () => {
      const images = ['/image1.jpg', '/image2.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[tabindex="0"]');
      if (gallery) fireEvent.keyDown(gallery, { key: 'Enter' });
      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
    });
  });

  describe('Свайп на мобильных устройствах', () => {
    it('переключает на следующее изображение при свайпе влево', async () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[class*="gallery"]');
      if (gallery) {
        fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
        fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 0 }] });
        fireEvent.touchEnd(gallery, { touches: [] });
      }

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 2`)).toBeInTheDocument();
      });
    });

    it('переключает на предыдущее изображение при свайпе вправо', async () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[class*="gallery"]');
      if (gallery) {
        fireEvent.touchStart(gallery, { touches: [{ clientX: 100, clientY: 0 }] });
        fireEvent.touchMove(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
        fireEvent.touchEnd(gallery, { touches: [] });
      }

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 3`)).toBeInTheDocument();
      });
    });

    it('не переключает при коротком свайпе', () => {
      const images = ['/image1.jpg', '/image2.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[class*="gallery"]');
      if (gallery) {
        fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
        fireEvent.touchMove(gallery, { touches: [{ clientX: 180, clientY: 0 }] });
        fireEvent.touchEnd(gallery, { touches: [] });
      }

      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
    });
  });

  describe('Быстрые свайпы на мобильных устройствах (race condition)', () => {
    it('корректно обрабатывает несколько быстрых свайпов', async () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg', '/image4.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const gallery = container.querySelector('[class*="gallery"]');

      if (!gallery) return;

      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 0 }] });
      fireEvent.touchEnd(gallery, { touches: [] });

      fireEvent.touchStart(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 100, clientY: 0 }] });
      fireEvent.touchEnd(gallery, { touches: [] });

      fireEvent.touchStart(gallery, { touches: [{ clientX: 100, clientY: 0 }] });
      fireEvent.touchMove(gallery, { touches: [{ clientX: 200, clientY: 0 }] });
      fireEvent.touchEnd(gallery, { touches: [] });

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 3`)).toBeInTheDocument();
      });
    });
  });

  describe('Пограничные случаи', () => {
    it('обрабатывает массив с одним изображением', () => {
      const images = ['/image1.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      expect(screen.queryByLabelText('Предыдущее изображение')).not.toBeInTheDocument();
    });

    it('обрабатывает массив с дублирующимися URL', () => {
      const images = ['/image1.jpg', '/image1.jpg', '/image1.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getAllByAltText(new RegExp(`${defaultAlt} - фото`))).toHaveLength(3);
      expect(screen.getAllByRole('button', { name: /Перейти к изображению/ })).toHaveLength(3);
    });

    it('обрабатывает очень длинный массив (10+ изображений)', () => {
      const images = Array.from({ length: 15 }, (_, i) => `/image${i + 1}.jpg`);
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getAllByRole('button', { name: /Перейти к изображению/ })).toHaveLength(15);
    });

    it('синхронизирует индекс при изменении массива изображений', () => {
      const { rerender } = render(
        <ProductImageGallery
          images={['/image1.jpg', '/image2.jpg', '/image3.jpg']}
          alt={defaultAlt}
        />,
      );

      rerender(<ProductImageGallery images={['/image1.jpg', '/image2.jpg']} alt={defaultAlt} />);
      expect(screen.getAllByRole('button', { name: /Перейти к изображению/ })).toHaveLength(2);
    });

    it('сбрасывает индекс при уменьшении массива', () => {
      const { rerender } = render(
        <ProductImageGallery
          images={['/image1.jpg', '/image2.jpg', '/image3.jpg']}
          alt={defaultAlt}
        />,
      );

      const indicator3 = screen.getByLabelText('Перейти к изображению 3');
      fireEvent.click(indicator3);

      rerender(<ProductImageGallery images={['/image1.jpg']} alt={defaultAlt} />);
      expect(screen.queryByLabelText('Предыдущее изображение')).not.toBeInTheDocument();
    });
  });

  describe('Обработка ошибок загрузки изображений', () => {
    it('показывает placeholder при ошибке загрузки', async () => {
      const images = ['/invalid-image.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const image = screen.getByTestId('image-0');

      await act(async () => {
        fireEvent.error(image);
      });

      await waitFor(() => {
        expect(screen.getByAltText('Test Product - фото 1 (не загружено)')).toBeInTheDocument();
      });
    });

    it('обрабатывает ошибки для нескольких изображений', async () => {
      const images = ['/image1.jpg', '/invalid-image.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);

      const invalidImage = screen.getByTestId('image-1');

      await act(async () => {
        fireEvent.error(invalidImage);
      });

      await waitFor(() => {
        expect(screen.getByAltText('Test Product - фото 2 (не загружено)')).toBeInTheDocument();
      });
    });
  });

  describe('Доступность', () => {
    it('имеет правильные ARIA атрибуты для индикаторов', () => {
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const indicators = screen.getAllByRole('button', { name: /Перейти к изображению/ });
      expect(indicators[0]).toHaveAttribute('aria-current', 'true');
      expect(indicators[1]).toHaveAttribute('aria-current', 'false');
      expect(indicators[2]).toHaveAttribute('aria-current', 'false');
    });

    it('обновляет aria-current при переключении', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);

      const indicators = screen.getAllByRole('button', { name: /Перейти к изображению/ });
      await user.click(indicators[1]);

      await waitFor(() => {
        expect(indicators[0]).toHaveAttribute('aria-current', 'false');
        expect(indicators[1]).toHaveAttribute('aria-current', 'true');
      });
    });

    it('галерея имеет tabIndex для фокуса', async () => {
      const images = ['/image1.jpg', '/image2.jpg'];
      const { container } = render(<ProductImageGallery images={images} alt={defaultAlt} />);

      await waitFor(() => {
        expect(container.querySelector('[tabindex="0"]')).toBeInTheDocument();
      });
    });

    it('кнопки навигации имеют правильные aria-label', () => {
      const images = ['/image1.jpg', '/image2.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      expect(screen.getByLabelText('Предыдущее изображение')).toBeInTheDocument();
      expect(screen.getByLabelText('Следующее изображение')).toBeInTheDocument();
    });
  });

  describe('Быстрое переключение (race conditions)', () => {
    it('корректно обрабатывает быстрое переключение', async () => {
      const user = userEvent.setup();
      const images = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];
      render(<ProductImageGallery images={images} alt={defaultAlt} />);
      const nextButton = screen.getByLabelText('Следующее изображение');

      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByAltText(`${defaultAlt} - фото 1`)).toBeInTheDocument();
      });
    });
  });
});
