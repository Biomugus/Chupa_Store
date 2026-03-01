// src/app/(main)/catalog/[slug]/page.tsx

import { getProduct } from '@/modules/catalog/api/getProduct';
import ProductDetailPage from '@/modules/catalog/components/ProductDetailPage/ProductDetailPage';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type CatalogSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CatalogSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Товар не найден — Мастерская Чупы' };
  }

  const title = `${product.title} — Мастерская Чупы`;
  const description =
    product.description?.slice(0, 160) ||
    `${product.title} — купить в Мастерской Чупы. Ручная работа, оружейное качество.`;
  const image = product.images?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: product.title }] }),
    },
  };
}

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailPage product={product} />
    </>
  );
}
