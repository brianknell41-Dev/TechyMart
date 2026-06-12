import Link from 'next/link';
import { Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-main flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <Package className="mb-6 h-16 w-16 text-gray-300" />
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link href="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
