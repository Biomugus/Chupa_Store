import { useEffect, useState } from 'react';

import { getCatalog } from '../api/getCatalog';
import { CatalogItem } from '../types/CatalogItem';

export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getCatalog()
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
