import CartItem from '@/modules/cart/components/CartItem';
import CartSummary from '@/modules/cart/components/CartSummary';
import { useCart } from '@/modules/cart/hooks/useCart';

export default function CartPage() {
  const { items, total, loading } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  return (
    <section>
      <div>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <CartSummary total={total} />
    </section>
  );
}

