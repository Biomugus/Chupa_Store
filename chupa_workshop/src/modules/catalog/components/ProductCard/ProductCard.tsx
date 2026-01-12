import { formatPrice } from '@/shared/lib/formatPrice'

import { useCart } from '@/modules/cart/hooks/useCart'
import { CatalogItem } from '../../types/CatalogItem'
import { Product } from '../../types/Product'

import styles from './productCard.module.css'
import ProductImageGallery from './ProductImageGallery'

type ProductCardProps = {
  product: CatalogItem | Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const images =
    (product as Product).images ??
    product.images ??
    (product.image ? [product.image] : ['/images/placeholder.jpg'])

  const { addItem } = useCart()

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: images[0],
    }

    addItem(cartItem)
  }

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <ProductImageGallery images={images} alt={product.title} />
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.right}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.description}>{product.equipment}</p>
          <p className={styles.description}>{product.characteristics}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.addButton} onClick={handleAddToCart}>
            В корзину
          </button>
        </div>
      </div>
    </article>
  )
}
