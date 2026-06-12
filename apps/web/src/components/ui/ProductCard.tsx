'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { StarRating } from './StarRating';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { token } = useAuthStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = product.discount ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
    });
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    try {
      const res = await api.toggleWishlist(product._id, token);
      setWishlisted(res.added);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="card block overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-lg bg-accent-500 px-2 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
          {product.flashDeal && (
            <span className="absolute right-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
              Flash Deal
            </span>
          )}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all hover:bg-white',
              wishlisted && 'text-red-500'
            )}
            aria-label="Add to wishlist"
          >
            <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
          </button>
        </div>

        <div className="p-4">
          {product.brand && (
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-600">
              {product.brand}
            </p>
          )}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600">
            {product.name}
          </h3>
          <StarRating rating={product.rating} size="sm" showValue reviewCount={product.reviewCount} />
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <p className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:opacity-50"
              aria-label="Add to cart"
            >
              <ShoppingCart className={cn('h-4 w-4', adding && 'animate-bounce')} />
            </button>
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="mt-2 text-xs font-medium text-orange-600">Only {product.stock} left!</p>
          )}
          {product.stock === 0 && (
            <p className="mt-2 text-xs font-medium text-red-500">Out of stock</p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
