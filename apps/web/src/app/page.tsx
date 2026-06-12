import Link from 'next/link';
import { HeroSection, WhyChooseUs, ReviewsSection } from '@/components/home/HomeSections';
import { Newsletter } from '@/components/home/Newsletter';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ProductCard } from '@/components/ui/ProductCard';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ArrowRight } from 'lucide-react';
import type { Product, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [featuredRes, categoriesRes, flashRes] = await Promise.all([
    fetchData<{ products: Product[] }>('/api/products/featured'),
    fetchData<{ categories: Category[] }>('/api/categories/featured'),
    fetchData<{ products: Product[] }>('/api/products/flash-deals'),
  ]);

  const featuredProducts = featuredRes?.products ?? [];
  const categories = categoriesRes?.categories ?? [];
  const flashDeals = flashRes?.products ?? [];
  const flashEndDate = flashDeals[0]?.flashDealEndsAt;

  return (
    <>
      <HeroSection />

      {/* Featured Categories */}
      <section id="categories" className="py-12 sm:py-16" aria-labelledby="categories-heading">
        <div className="container-main">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 id="categories-heading" className="section-title">Shop by Category</h2>
              <p className="mt-2 text-gray-600">Find exactly what you need</p>
            </div>
            <Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, i) => (
                <CategoryCard key={cat._id} category={cat} index={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {['Electronics', 'Smart Watches', 'Solar Solutions', 'Kitchen Appliances', 'Home Improvement', 'Power & Charging'].map((name, i) => (
                <Link key={name} href={`/products?category=${name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="card flex h-32 items-center justify-center p-6">
                  <span className="text-lg font-semibold text-gray-700">{name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12 sm:py-16" aria-labelledby="featured-heading">
        <div className="container-main">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 id="featured-heading" className="section-title">Featured Products</h2>
              <p className="mt-2 text-gray-600">Hand-picked bestsellers for you</p>
            </div>
            <Link href="/products?featured=true" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 sm:flex">
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500">Products loading soon. Start the API and run seed.</p>
              <Link href="/products" className="btn-primary mt-4">Browse Shop</Link>
            </div>
          )}
        </div>
      </section>

      {/* Flash Deals */}
      {flashDeals.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12 sm:py-16">
          <div className="container-main">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase text-white">Limited Time</span>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Flash Deals</h2>
                <p className="mt-1 text-white/80">Grab these deals before they are gone!</p>
              </div>
              {flashEndDate && (
                <div>
                  <p className="mb-2 text-sm font-medium text-white/80">Ends in:</p>
                  <CountdownTimer endDate={flashEndDate} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {flashDeals.map((product, i) => (
                <div key={product._id} className="[&_.card]:border-0 [&_.card]:shadow-lg">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <WhyChooseUs />
      <ReviewsSection />
      <Newsletter />
    </>
  );
}
