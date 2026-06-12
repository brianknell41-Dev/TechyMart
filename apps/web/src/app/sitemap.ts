import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/products', '/login', '/register'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100`);
    if (res.ok) {
      const data = await res.json();
      productPages = (data.products || []).map((p: { slug: string; updatedAt?: string }) => ({
        url: `${SITE_URL}/products/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    /* API may be offline during build */
  }

  return [...staticPages, ...productPages];
}
