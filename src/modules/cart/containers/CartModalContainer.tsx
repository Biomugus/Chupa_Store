'use client';

import CheckoutFormContainer from '@/modules/checkout/containers/CheckoutFormContainer';
import { useModal } from '@/shared/ui/modal/ModalContext';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CartModalView } from '../types/CartModalContainerProps';
import { CartModalUi } from '../ui/CartModalUI';
import { CartPageUI } from '../ui/CartPageUI';
import { CartSuccessView } from '../ui/CartSuccessView';

export const CartModalContainer = observer(() => {
  const { modal, closeModal } = useModal();
  const { items, total, loading, clear, changeQuantity } = useCart();

  const [view, setView] = useState<CartModalView>('cart');

  const handleCheckoutSuccess = () => {
    (clear(), setView('success'));
  };

  const handleClose = () => {
    setView('cart');
    closeModal();
  };

  return (
    <>
      <CartModalUi isOpen={modal.type === 'cart'} onClose={handleClose}>
        {view === 'cart' && (
          <CartPageUI
            items={items}
            total={total}
            loading={loading}
            onCheckout={() => setView('checkout')}
            onChangeQuantity={changeQuantity}
          />
        )}

        {view === 'success' && (
          <CartSuccessView
            onClose={() => {
              setView('cart');
              closeModal();
            }}
          />
        )}

        {view === 'checkout' && (
          <CheckoutFormContainer
            cartSnapshot={{ items, total }}
            onCloseCart={closeModal}
            onOpenSuccessModal={handleCheckoutSuccess}
            clearCart={clear}
          />
        )}
      </CartModalUi>
    </>
  );
});
