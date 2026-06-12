import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import type { Product } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data?.product) return { title: 'Product Not Found' };

  const product = data.product as Product;
  return {
    title: product.name,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data?.product) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.product.name,
    description: data.product.description,
    image: data.product.images,
    sku: data.product.sku,
    brand: { '@type': 'Brand', name: data.product.brand || 'TechyMart' },
    offers: {
      '@type': 'Offer',
      price: data.product.price,
      priceCurrency: 'NGN',
      availability: data.product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: data.product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: data.product.rating,
      reviewCount: data.product.reviewCount,
    } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={data.product} related={data.related} />
    </>
  );
}
