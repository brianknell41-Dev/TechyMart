import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'TechyMart — Smart Technology. Better Living.',
    template: '%s | TechyMart',
  },
  description:
    'Shop premium technology, home appliances, solar solutions, smart watches, and everyday gadgets at TechyMart. Fast delivery, secure payments, quality guaranteed.',
  keywords: ['ecommerce', 'technology', 'gadgets', 'smart home', 'solar', 'power bank', 'Nigeria'],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'TechyMart',
    title: 'TechyMart — Smart Technology. Better Living.',
    description: 'Premium online marketplace for technology and lifestyle products.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechyMart',
    description: 'Premium online marketplace for technology and lifestyle products.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
