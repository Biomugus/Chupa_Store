// src/modules/catalog/components/ProductCard/DetailsButton.tsx

import Link from 'next/link';
import btnStyles from '../../../../shared/ui/buttons/buttons.module.css';
import { Product } from '../../model/productsSchema';
import styles from './productCard.module.css';

export default function DetailsButton({ product }: { product: Product }) {
  return (
    <Link href={`/catalog/${product.slug}`} className={`${btnStyles.btnBrand} ${styles.addButton}`}>
      О товаре
    </Link>
  );
}
