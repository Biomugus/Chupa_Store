'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import 'photoswipe/dist/photoswipe.css';
import { useCallback, useEffect, useState } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';
import styles from './productImageGallery.module.css';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    align: 'start',
    skipSnaps: false,
    watchSlides: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const validImages = images.length > 0 ? images : ['/images/placeholders/placeholder.jpg'];

  return (
    <Gallery options={{ showHideAnimationType: 'zoom', initialZoomLevel: 'fit' }}>
      <div className={styles.gallery}>
        <div className={styles.media} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {validImages.map((src, index) => (
              <div className={styles.emblaSlide} key={index}>
                <Item original={src} thumbnail={src} width="1920" height="1080">
                  {({ ref, open }) => (
                    <div
                      className={styles.imageWrapper}
                      onClick={open}
                      style={{ cursor: 'zoom-in' }}
                    >
                      <Image
                        ref={ref as React.Ref<HTMLImageElement>}
                        src={src}
                        alt={`${alt} - ${index + 1}`}
                        fill
                        priority={index === 0}
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </Item>
              </div>
            ))}
          </div>
        </div>

        {validImages.length > 1 && (
          <>
            <button className={styles.navButton} onClick={scrollPrev}>
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
            <button className={`${styles.navButton} ${styles.navButtonRight}`} onClick={scrollNext}>
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
                  className={`${styles.indicator} ${i === selectedIndex ? styles.indicatorActive : ''}`}
                  onClick={() => scrollTo(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Gallery>
  );
}
