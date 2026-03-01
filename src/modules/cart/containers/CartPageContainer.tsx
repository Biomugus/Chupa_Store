'use client';

// src/modules/cart/containers/CartPageContainer.tsx

import CheckoutFormContainer from '@/modules/checkout/containers/CheckoutFormContainer';
import { useIsGuest } from '@/shared/hooks/useIsGuest';
import Modal from '@/shared/ui/modal/Modal';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CartPageUI } from '../ui/CartPageUI';
import { CartSuccessView } from '../ui/CartSuccessView';
import { RegistrationNudge } from '../ui/RegistrationNudge';

type CheckoutView = 'idle' | 'nudge' | 'checkout' | 'success';

export const CartPageContainer = () => {
  const { items, total, clear, changeQuantity } = useCart();
  const isGuest = useIsGuest();

  const [checkoutView, setCheckoutView] = useState<CheckoutView>('idle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCheckout = () => {
    if (isGuest) {
      setCheckoutView('nudge');
    } else {
      setCheckoutView('checkout');
    }
  };

  const handleCheckoutSuccess = () => {
    clear();
    setCheckoutView('success');
  };

  const handleCloseModal = () => {
    setCheckoutView('idle');
  };

  const isModalOpen = checkoutView !== 'idle';

  return (
    <>
      <CartPageUI
        items={items}
        total={total}
        mounted={mounted}
        onCheckout={handleCheckout}
        onChangeQuantity={changeQuantity}
      />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {checkoutView === 'nudge' && (
          <RegistrationNudge onContinueAsGuest={() => setCheckoutView('checkout')} />
        )}

        {checkoutView === 'checkout' && (
          <CheckoutFormContainer
            cartSnapshot={{ items, total }}
            onOpenSuccessModal={handleCheckoutSuccess}
          />
        )}

        {checkoutView === 'success' && <CartSuccessView onClose={handleCloseModal} />}
      </Modal>
    </>
  );
};
