'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, Zap, Heart, Truck, Shield, RotateCcw, ZoomIn } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { StarRating } from '@/components/ui/StarRating';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import type { Product, Review } from '@/types';

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { token } = useAuthStore();

  useEffect(() => {
    api.getReviews(product._id).then((r) => setReviews(r.reviews as Review[])).catch(() => {});
  }, [product._id]);

  const discount = product.discount ?? 0;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <div className="container-main py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-brand-600">Products</Link></li>
          <li>/</li>
          <li className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-lg bg-accent-500 px-3 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
            <button
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white"
              aria-label="Zoom image"
            >
              <ZoomIn className="h-4 w-4" /> Zoom
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                    selectedImage === i ? 'border-brand-600' : 'border-transparent'
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.brand && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">{product.brand}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
          <div className="mt-3">
            <StarRating rating={product.rating} size="md" showValue reviewCount={product.reviewCount} />
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-6 text-gray-600 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Quantity & Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-12 w-12 items-center justify-center hover:bg-gray-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="flex h-12 w-12 items-center justify-center hover:bg-gray-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn('btn-primary flex-1 sm:flex-none', added && 'bg-green-600')}
            >
              <ShoppingCart className="h-5 w-5" />
              {added ? 'Added!' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-secondary flex-1 sm:flex-none"
            >
              <Zap className="h-5 w-5" /> Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-gray-50 p-4">
            {[
              { icon: Truck, label: 'Fast Delivery' },
              { icon: Shield, label: 'Secure Payment' },
              { icon: RotateCcw, label: 'Easy Returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon className="h-5 w-5 text-brand-600" />
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 lg:mt-16">
        <div className="flex gap-1 border-b border-gray-200" role="tablist">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 text-sm font-semibold capitalize transition-colors',
                activeTab === tab ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab === 'specs' ? 'Specifications' : tab}
              {tab === 'reviews' && ` (${product.reviewCount})`}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-3 font-medium text-gray-900">{spec.key}</td>
                      <td className="px-6 py-3 text-gray-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      {review.verified && <span className="text-xs text-green-600">Verified Purchase</span>}
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.title && <p className="mt-2 font-medium">{review.title}</p>}
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-100 pt-12">
          <h2 className="section-title mb-8">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {(related as Product[]).map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setZoomOpen(false)}>
          <div className="relative h-full max-h-[90vh] w-full max-w-4xl">
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-contain" sizes="90vw" />
          </div>
        </div>
      )}
    </div>
  );
}
