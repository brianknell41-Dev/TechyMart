import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Grid3X3 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent-500 blur-3xl" />
      </div>

      <div className="container-main relative">
        <div className="grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div className="animate-slide-up text-center lg:text-left">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-200 backdrop-blur">
              New arrivals every week
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Smart Technology.
              <br />
              <span className="text-brand-300">Better Living.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-brand-100 lg:mx-0 mx-auto">
              Discover premium gadgets, solar solutions, kitchen appliances, and everyday tech — all in one trusted marketplace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/products" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 hover:shadow-xl">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <Link href="/products#categories" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                <Grid3X3 className="h-5 w-5" />
                Explore Categories
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Customers' },
                { value: '4.8★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-brand-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-4 rounded-3xl bg-white/5 backdrop-blur-sm" />
              <Image
                src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80"
                alt="Premium technology products including smart watches, earbuds, and gadgets"
                fill
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
                className="rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const features = [
    {
      icon: '🚀',
      title: 'Fast Delivery',
      description: 'Nationwide shipping with express options. Most orders delivered within 2-5 business days.',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Bank transfer, mobile payment, pay on delivery, and WhatsApp checkout — all protected.',
    },
    {
      icon: '✨',
      title: 'Quality Products',
      description: 'Every product is vetted for quality. 30-day return policy on eligible items.',
    },
    {
      icon: '💬',
      title: 'Customer Support',
      description: '24/7 support via WhatsApp, email, and phone. We are here when you need us.',
    },
  ];

  return (
    <section className="py-12 sm:py-16" aria-labelledby="why-choose-heading">
      <div className="container-main">
        <div className="mb-10 text-center">
          <h2 id="why-choose-heading" className="section-title">Why Choose TechyMart</h2>
          <p className="mt-3 text-gray-600">Shopping made simple, secure, and satisfying</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6 text-center">
              <span className="mb-4 inline-block text-4xl" role="img" aria-hidden="true">{feature.icon}</span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    { name: 'Ada O.', rating: 5, text: 'Best online tech store I have used. Fast delivery and genuine products!', product: 'Power Bank' },
    { name: 'Chidi M.', rating: 5, text: 'The smart watch exceeded my expectations. Great value for money.', product: 'SmartFit Pro' },
    { name: 'Fatima A.', rating: 5, text: 'Solar panel kit arrived well packaged. Installation was straightforward.', product: 'SolarMax Kit' },
    { name: 'James K.', rating: 4, text: 'Excellent customer service via WhatsApp. They helped me choose the right inverter.', product: 'PureFlow Inverter' },
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16" aria-labelledby="reviews-heading">
      <div className="container-main">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 id="reviews-heading" className="section-title">What Our Customers Say</h2>
            <p className="mt-2 text-gray-600">Trusted by thousands of happy shoppers</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-sm">
            <span className="text-3xl font-bold text-gray-900">4.8</span>
            <div>
              <div className="text-amber-400">★★★★★</div>
              <p className="text-xs text-gray-500">Based on 2,000+ reviews</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <blockquote key={review.name} className="card p-6">
              <div className="mb-3 text-amber-400" aria-label={`${review.rating} stars`}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-700">&ldquo;{review.text}&rdquo;</p>
              <footer>
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-xs text-gray-500">Purchased: {review.product}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlashDealsSection({
  products,
  endDate,
}: {
  products: Array<{ _id: string; name: string; slug: string; price: number; compareAtPrice?: number; discount?: number; images: string[]; stock: number; rating: number; reviewCount: number; brand?: string; flashDeal?: boolean }>;
  endDate?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12 sm:py-16" aria-labelledby="flash-deals-heading">
      <div className="container-main">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase text-white">
              Limited Time
            </span>
            <h2 id="flash-deals-heading" className="text-2xl font-bold text-white sm:text-3xl">
              Flash Deals
            </h2>
            <p className="mt-1 text-white/80">Grab these deals before they are gone!</p>
          </div>
          {endDate && (
            <div>
              <p className="mb-2 text-sm font-medium text-white/80">Ends in:</p>
              {/* Countdown imported in page */}
            </div>
          )}
          <Link
            href="/products?flashDeal=true"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            View All Deals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.slice(0, 4).map((product, i) => (
            <Link key={product._id} href={`/products/${product.slug}`} className="group">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform group-hover:scale-[1.02]">
                <div className="relative aspect-square">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="25vw" />
                  {(product.discount ?? 0) > 0 && (
                    <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-lg font-bold text-red-600">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.stock <= 10 && (
                    <p className="mt-1 text-xs font-medium text-orange-600">{product.stock} left in stock</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
