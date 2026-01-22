import { formatPrice } from '@/shared/lib/formatPrice';
import styles from './cartSummaryUI.module.css';

type CartSummaryProps = {
  total: number;
};

export default function CartSummaryUi({ total }: CartSummaryProps) {
  return (
    <aside>
      <span className={styles.price}>Итого: {formatPrice(total)}</span>
    </aside>
  );
}
