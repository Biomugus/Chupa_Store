'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import styles from './productImageGallery.module.css';

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const trackRef = useRef<HTMLDivElement>(null);

  const hasMultiple = images.length > 1;
  const validImages = images.length > 0 ? images : ['/images/placeholders/placeholder.jpg'];

  const prev = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [hasMultiple, images.length]);

  const next = useCallback(() => {
    if (!hasMultiple) return;
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [hasMultiple, images.length]);

  const goTo = useCallback(
    (index: number) => {
      if (hasMultiple) setCurrentIndex(index);
    },
    [hasMultiple],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultiple) return;
      const touch = e.touches[0].clientX;
      let startX = touch;
      let endX: number;

      const move = (ev: TouchEvent) => (endX = ev.touches[0].clientX);
      const end = () => {
        if (!endX) return;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
      };

      document.addEventListener('touchmove', move);
      document.addEventListener('touchend', end);
    },
    [hasMultiple, next, prev],
  );

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
      trackRef.current.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  }, [currentIndex]);

  const handleError = useCallback((index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  }, []);

  return (
    <div className={styles.gallery} onTouchStart={handleTouchStart} aria-live="polite" tabIndex={0}>
      <div className={styles.media}>
        <div ref={trackRef} className={styles.track}>
          {validImages.map((src, idx) => {
            const isFailed = failedImages.has(idx);
            const finalSrc = isFailed ? '/images/placeholders/placeholder.jpg' : src;
            const finalAlt = isFailed
              ? `${alt} - фото ${idx + 1} (не загружено)`
              : `${alt} - фото ${idx + 1}`;

            return (
              <div key={src + idx} className={styles.imageWrapper}>
                <Image
                  src={finalSrc}
                  alt={finalAlt}
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className={styles.image}
                  onError={() => handleError(idx)}
                  unoptimized={isFailed}
                  data-testid={`image-${idx}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className={styles.navButton}
            onClick={prev}
            aria-label="Предыдущее изображение"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={next}
            aria-label="Следующее изображение"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.indicators}>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.indicator} ${i === currentIndex ? styles.indicatorActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Перейти к изображению ${i + 1}`}
                aria-current={i === currentIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
