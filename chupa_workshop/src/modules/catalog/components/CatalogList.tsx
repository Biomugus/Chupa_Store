import Filters from './Filters';
import ProductCard from './ProductCard';

import { useCatalog } from '../hooks/useCatalog';

export default function CatalogList() {
  const { items, loading } = useCatalog();

  if (loading) {
    return <div>Loading catalog...</div>;
  }

  return (
    <section>
      <Filters />
      <div>
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}

