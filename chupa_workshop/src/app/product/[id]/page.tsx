import ProductGallery from '@/modules/product/components/ProductGallery';
import ProductTabs from '@/modules/product/components/ProductTabs';
import { useProduct } from '@/modules/product/hooks/useProduct';

type ProductPageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { product, loading } = useProduct(params.id);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductTabs description={product.description} />
    </div>
  );
}
