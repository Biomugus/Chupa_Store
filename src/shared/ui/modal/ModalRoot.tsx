// src/shared/ui/modal/ModalRoot.tsx

'use client';

import { Product } from '@/app/api/products/productsShema';
import { CartModalContainer } from '@/modules/cart/containers/CartModalContainer';
import FiltersSidebar from '@/modules/catalog/components/FiltersSidebar/FiltersSidebar';
import { AddToCartButton } from '@/modules/catalog/components/ProductCard/AddToCartButton';
import { formatPrice } from '@/shared/lib/formatPrice';
import Modal from './Modal';
import styles from './Modal.module.css';
import { useModal } from './ModalContext';

export function ModalRoot() {
  const { modal, closeModal } = useModal();
  const product = modal.payload as Product;

  return (
    <>
      <CartModalContainer />

      <Modal isOpen={modal.type === 'nav'} onClose={closeModal}>
        <p
          style={{
            padding: '50px 50px',
            color: 'black',
            fontSize: '16px',
            letterSpacing: '1px',
          }}
        >
          Раздел ещё на стадии разработки. Пока можете ознакомиться с каталогом :)
        </p>
      </Modal>

      {/* Модалка для товара */}
      {product && (
        <Modal isOpen={modal.type === 'product_detail'} onClose={closeModal}>
          <div className={styles.productDetailView}>
            <div className={styles.detailsModalBody}>
              <h2 className={styles.modalDetailsTitle}>{product.title}</h2>

              <div className={styles.section}>
                <h3 className={styles.modalSubheading}>О товаре</h3>
                <p>{product.content.description}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.modalSubheading}>Характеристики</h3>
                <p>{product.content.characteristics}</p>
              </div>

              <div className={styles.section}>
                <h3 className={styles.modalSubheading}>Совместимость</h3>
                <p>{product.content.compatibility}</p>
              </div>
            </div>

            <div className={styles.DetailsModalFooter}>
              <span className={styles.detailsModalPrice}>{formatPrice(product.price)}</span>
              <div>
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={modal.type === 'filters'} onClose={closeModal}>
        <div className={styles.filtersDrawer}>
          <FiltersSidebar />
        </div>
      </Modal>
    </>
  );
}
