import { useEffect, useState } from 'react';

import { getProduct } from '../api/getProduct';
import { Product } from '../types/Product';

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!slug) return;

    setLoading(true);
    getProduct(slug)
      .then((data) => {
        if (mounted) {
          setProduct(data);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  return { product, loading };
}
