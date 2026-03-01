import { CartItem as CartItemType } from './CartItem';

export type QuantityDelta = 1 | -1;

export type CartPageUIProps = {
  items: CartItemType[];
  total: number;
  mounted: boolean;
  onChangeQuantity: (id: string, delta: QuantityDelta) => void;

  onCheckout?: () => void;
};
