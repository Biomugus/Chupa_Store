'use client';

import Image from 'next/image';
import 'photoswipe/dist/photoswipe.css';
import { useCallback, useState } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import styles from './productImageGallery.module.css';

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const hasMultiple = images.length > 1;
  const validImages = images.length > 0 ? images : ['/images/placeholders/placeholder.jpg'];

  const next = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));
  }, [hasMultiple, validImages.length]);

  const prev = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  }, [hasMultiple, validImages.length]);

  const handleError = useCallback((index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  }, []);

  return (
    <Gallery
      options={{
        showHideAnimationType: 'zoom',
        initialZoomLevel: 'fit',
        secondaryZoomLevel: 1.5,
        maxZoomLevel: 3,
      }}
    >
      <div className={styles.gallery} aria-live="polite">
        <div className={styles.media}>
          <Item
            original={validImages[currentIndex]}
            thumbnail={validImages[currentIndex]}
            width="1920"
            height="1080"
          >
            {({ ref, open }) => {
              const isFailed = failedImages.has(currentIndex);
              const finalSrc = isFailed
                ? '/images/placeholders/placeholder.jpg'
                : validImages[currentIndex];

              return (
                <div className={styles.imageWrapper} onClick={open} style={{ cursor: 'zoom-in' }}>
                  <Image
                    ref={ref as unknown as React.MutableRefObject<HTMLImageElement>}
                    src={finalSrc}
                    alt={`${alt} - фото ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className={styles.image}
                    onError={() => handleError(currentIndex)}
                  />
                </div>
              );
            }}
          </Item>
        </div>

        {hasMultiple && (
          <>
            <button type="button" className={styles.navButton} onClick={prev} aria-label="Назад">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={next}
              aria-label="Вперед"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={styles.indicators}>
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.indicator} ${i === currentIndex ? styles.indicatorActive : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-current={i === currentIndex}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Gallery>
  );
}
