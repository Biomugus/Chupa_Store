import { formatPrice } from '@/shared/lib/formatPrice';

import { CatalogItem } from '../types/CatalogItem';
import { Product } from '../types/Product';

type ProductCardProps = {
  product: CatalogItem | Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article>
      <div>{product.title}</div>
      <div>{formatPrice(product.price)}</div>
    </article>
  );
}

