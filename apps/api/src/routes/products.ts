import { Router, Response } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { validateQuery } from '../middleware/validate.js';
import { calculateDiscount } from '../utils/helpers.js';

const router = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(48).default(12),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'rating', 'popular']).default('newest'),
  featured: z.coerce.boolean().optional(),
  flashDeal: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
});

function formatProduct(product: Record<string, unknown>) {
  const price = product.price as number;
  const compareAtPrice = product.compareAtPrice as number | undefined;
  return {
    ...product,
    discount: calculateDiscount(price, compareAtPrice),
    inStock: (product.stock as number) > 0,
  };
}

router.get('/', validateQuery(listQuerySchema), async (req, res: Response) => {
  const { page, limit, category, search, minPrice, maxPrice, minRating, sort, featured, flashDeal, inStock } =
    req.query as unknown as z.infer<typeof listQuerySchema>;
  const filter: Record<string, unknown> = { active: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }
  if (search) filter.$text = { $search: search };
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) (filter.price as Record<string, number>).$gte = minPrice;
    if (maxPrice !== undefined) (filter.price as Record<string, number>).$lte = maxPrice;
  }
  if (minRating !== undefined) filter.rating = { $gte: minRating };
  if (featured !== undefined) filter.featured = featured;
  if (flashDeal !== undefined) filter.flashDeal = flashDeal;
  if (inStock) filter.stock = { $gt: 0 };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { rating: -1 },
    popular: { reviewCount: -1 },
  };

  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort])
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products: products.map((p) => formatProduct(p as Record<string, unknown>)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

router.get('/featured', async (_req, res: Response) => {
  const products = await Product.find({ active: true, featured: true })
    .populate('category', 'name slug')
    .sort({ rating: -1 })
    .limit(8)
    .lean();
  res.json({ products: products.map((p) => formatProduct(p as Record<string, unknown>)) });
});

router.get('/flash-deals', async (_req, res: Response) => {
  const products = await Product.find({
    active: true,
    flashDeal: true,
    flashDealEndsAt: { $gt: new Date() },
  })
    .populate('category', 'name slug')
    .limit(6)
    .lean();
  res.json({ products: products.map((p) => formatProduct(p as Record<string, unknown>)) });
});

router.get('/:slug', async (req, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true })
    .populate('category', 'name slug')
    .lean();

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    active: true,
  })
    .limit(4)
    .lean();

  res.json({
    product: formatProduct(product as Record<string, unknown>),
    related: related.map((p) => formatProduct(p as Record<string, unknown>)),
  });
});

export default router;
