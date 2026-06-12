'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Package } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const flashDeal = searchParams.get('flashDeal') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const inStock = searchParams.get('inStock') === 'true';
  const page = parseInt(searchParams.get('page') || '1');

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    if (!updates.page) params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  useEffect(() => {
    api.getCategories().then((r) => setCategories(r.categories as Category[])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | boolean> = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minRating) params.minRating = minRating;
    if (flashDeal) params.flashDeal = true;
    if (featured) params.featured = true;
    if (inStock) params.inStock = true;

    api.getProducts(params)
      .then((data) => {
        setProducts(data.products as Product[]);
        setPagination(data.pagination as { page: number; pages: number; total: number });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, minRating, flashDeal, featured, inStock, page]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParams({ category: null })}
            className={cn('block w-full rounded-lg px-3 py-2 text-left text-sm', !category ? 'bg-brand-50 font-medium text-brand-700' : 'text-gray-600 hover:bg-gray-50')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParams({ category: cat.slug })}
              className={cn('block w-full rounded-lg px-3 py-2 text-left text-sm', category === cat.slug ? 'bg-brand-50 font-medium text-brand-700' : 'text-gray-600 hover:bg-gray-50')}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Price Range (₦)</h3>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParams({ minPrice: e.target.value || null })} className="input-field py-2" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParams({ maxPrice: e.target.value || null })} className="input-field py-2" />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Minimum Rating</h3>
        {[4, 3, 2].map((r) => (
          <button
            key={r}
            onClick={() => updateParams({ minRating: minRating === String(r) ? null : String(r) })}
            className={cn('mb-1 block w-full rounded-lg px-3 py-2 text-left text-sm', minRating === String(r) ? 'bg-brand-50 font-medium text-brand-700' : 'text-gray-600 hover:bg-gray-50')}
          >
            {r}+ Stars
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={inStock} onChange={(e) => updateParams({ inStock: e.target.checked ? 'true' : null })} className="rounded border-gray-300 text-brand-600" />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="container-main py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="section-title">
          {search ? `Results for "${search}"` : flashDeal ? 'Flash Deals' : featured ? 'Featured Products' : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="mt-2 text-gray-600">{pagination.total} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Desktop filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-2xl border border-gray-100 p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Filters</h2>
            <FilterPanel />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>

            <div className="relative ml-auto">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium',
                        p === page ? 'bg-brand-600 text-white' : 'border border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16">
              <Package className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search term</p>
              <button onClick={() => router.push('/products')} className="btn-primary mt-6">Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="h-6 w-6" />
              </button>
            </div>
            <FilterPanel />
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">Apply Filters</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPageClient() {
  return (
    <Suspense fallback={<div className="container-main py-12"><div className="skeleton h-96 rounded-2xl" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
