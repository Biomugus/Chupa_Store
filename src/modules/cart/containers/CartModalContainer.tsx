'use client';

import CheckoutFormContainer from '@/modules/checkout/containers/CheckoutFormContainer';
import { createClient } from '@/shared/api/supabase/client';
import { useModal } from '@/shared/ui/modal/ModalContext';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { CartModalView } from '../types/CartModalContainerProps';
import { CartModalUi } from '../ui/CartModalUI';
import { CartPageUI } from '../ui/CartPageUI';
import { CartSuccessView } from '../ui/CartSuccessView';
import { RegistrationNudge } from '../ui/RegistrationNudge';

export const CartModalContainer = observer(() => {
  const { modal, closeModal } = useModal();
  const { items, total, loading, clear, changeQuantity } = useCart();

  const [view, setView] = useState<CartModalView>('cart');
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsGuest(!user);
    });
  }, []);

  const handleCheckout = () => {
    if (isGuest) {
      setView('nudge');
    } else {
      setView('checkout');
    }
  };

  const handleCheckoutSuccess = () => {
    clear();
    setView('success');
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
            onCheckout={handleCheckout}
            onChangeQuantity={changeQuantity}
          />
        )}

        {view === 'nudge' && <RegistrationNudge onContinueAsGuest={() => setView('checkout')} />}

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
