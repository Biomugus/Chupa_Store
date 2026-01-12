'use client';

import { useEffect, useState } from 'react';

import { getProductById } from '../api/getProductById';
import { Product } from '../types/Product';

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!id) return;

    setLoading(true);
    getProductById(id)
      .then((data) => {
        if (mounted) {
          setProduct(data);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  return { product, loading };
}
