'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { token } = useAuthStore();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.getWishlist(token)
      .then((r) => setWishlist(r.wishlist as Product[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="skeleton h-64 rounded-2xl" />;

  if (wishlist.length === 0) {
    return (
      <div className="card flex flex-col items-center py-16 text-center">
        <Heart className="mb-4 h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold">Your wishlist is empty</h2>
        <Link href="/products" className="btn-primary mt-6">Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">My Wishlist</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {wishlist.map((product) => (
          <Link key={product._id} href={`/products/${product.slug}`} className="card overflow-hidden">
            <div className="relative aspect-square">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
              <p className="mt-2 font-bold text-brand-600">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
