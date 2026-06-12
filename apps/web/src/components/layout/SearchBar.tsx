'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useSearchStore } from '@/store/search';
import { formatPrice, cn } from '@/lib/utils';
import type { Product, Category } from '@/types';

export function SearchBar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ products: Product[]; categories: Category[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.search(q);
      setResults({ products: data.products as Product[], categories: data.categories as Category[] });
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      onClose?.();
    }
  };

  const handleSelect = (term: string) => {
    addRecentSearch(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    setOpen(false);
    onClose?.();
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search products, categories..."
            className="input-field pl-11 pr-10"
            aria-label="Search products"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {open && (query.length >= 2 || recentSearches.length > 0) && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
            {loading && (
              <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
            )}

            {!loading && query.length < 2 && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-xs font-semibold uppercase text-gray-500">Recent Searches</span>
                  <button onClick={clearRecentSearches} className="text-xs text-brand-600 hover:underline">
                    Clear
                  </button>
                </div>
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-gray-50"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>
            )}

            {!loading && results && (
              <>
                {results.categories.length > 0 && (
                  <div className="border-b border-gray-100 p-3">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">Categories</p>
                    {results.categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => { setOpen(false); onClose?.(); }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50"
                      >
                        <Tag className="h-4 w-4 text-brand-500" />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {results.products.length > 0 && (
                  <div className="p-3">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-500">Products</p>
                    {results.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product.slug}`}
                        onClick={() => { addRecentSearch(query); setOpen(false); onClose?.(); }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-sm font-bold text-brand-600">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSubmit}
                      className="mt-2 w-full rounded-xl py-2 text-center text-sm font-medium text-brand-600 hover:bg-brand-50"
                    >
                      View all results for &quot;{query}&quot;
                    </button>
                  </div>
                )}

                {results.products.length === 0 && results.categories.length === 0 && (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No results found for &quot;{query}&quot;
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
