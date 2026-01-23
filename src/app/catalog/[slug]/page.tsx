'use client';

import { Suspense } from 'react';

import ProductCard from '@/modules/catalog/components/ProductCard/ProductCard';
import { useProduct } from '@/modules/catalog/hooks/useProduct';

type CatalogSlugPageProps = {
  params: { slug: string };
};

function CatalogSlugContent({ slug }: { slug: string }) {
  const { product, loading } = useProduct(slug);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductCard product={product} />;
}

export default function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogSlugContent slug={params.slug} />
    </Suspense>
  );
}
