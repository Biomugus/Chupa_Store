import { CartItem as CartItemType } from './CartItem';

export type QuantityDelta = 1 | -1;

export type CartPageUIProps = {
  items: CartItemType[];
  total: number;
  loading: boolean;
  onChangeQuantity: (id: string, delta: QuantityDelta) => void;

  onCheckout?: () => void;
  footerSlot?: React.ReactNode;
};
