import { CartItem as CartItemType } from '../types/CartItem';

export type CartModalUIProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemType[];
  total: number;
  loading: boolean;
  onRemoveItem: (id: string) => void;
};
