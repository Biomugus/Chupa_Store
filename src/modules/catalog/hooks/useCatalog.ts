// src/modules/catalog/hooks/useCatalog.ts

import { useEffect, useState } from 'react';

import { getProducts } from '../api/getCatalog';
import { CatalogItem } from '../types/CatalogItem';

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (mounted) {
          setItems(data);
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading };
}
