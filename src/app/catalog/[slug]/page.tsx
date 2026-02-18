import { getProduct } from '@/modules/catalog/api/getProduct';
import ProductCard from '@/modules/catalog/components/ProductCard/ProductCard';
import { notFound } from 'next/navigation';

type CatalogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ padding: '20px' }}>
      <ProductCard product={product} />
    </div>
  );
}
