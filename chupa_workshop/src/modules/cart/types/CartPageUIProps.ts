import { CartItem as CartItemType } from './CartItem';

export type CartPageUIProps = {
  items: CartItemType[];
  total: number;
  loading: boolean;
  onRemoveItem: (id: string) => void;

  onCheckout?: () => void;
  footerSlot?: React.ReactNode;
};
