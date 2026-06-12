import Link from 'next/link';
import { Zap, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=electronics', label: 'Electronics' },
    { href: '/products?category=smart-watches', label: 'Smart Watches' },
    { href: '/products?category=solar-solutions', label: 'Solar Solutions' },
    { href: '/products?flashDeal=true', label: 'Flash Deals' },
  ],
  support: [
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping Info' },
    { href: '/returns', label: 'Returns & Refunds' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-950 text-gray-300">
      <div className="container-main py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Techy<span className="text-brand-400">Mart</span>
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Your premium destination for technology, home, lifestyle, and improvement products. Quality you can trust.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-colors hover:bg-brand-600 hover:text-white"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Shop</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                Lagos, Nigeria
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                +234 800 000 0000
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                support@techymart.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TechyMart. All rights reserved.
          </p>
          <div className="flex gap-6">
            {FOOTER_LINKS.company.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
