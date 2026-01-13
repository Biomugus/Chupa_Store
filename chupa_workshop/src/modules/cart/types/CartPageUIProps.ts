import { CartItem as CartItemType } from '../types/CartItem';

export type CartPageUIProps = {
  items: CartItemType[];
  total: number;
  loading: boolean;
  onRemoveItem?: (id: string) => void;
};
