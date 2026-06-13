import { Router, Response } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { searchLimiter } from '../middleware/rateLimit.js';
import { validateQuery } from '../middleware/validate.js';
import { calculateDiscount } from '../utils/helpers.js';

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(20).default(8),
});

router.get('/', searchLimiter, validateQuery(searchSchema), async (req, res: Response) => {
  const { q, limit } = req.query as unknown as z.infer<typeof searchSchema>;

  const [products, categories] = await Promise.all([
    Product.find({ active: true, $text: { $search: q } })
      .select('name slug price compareAtPrice images rating category')
      .populate('category', 'name slug')
      .limit(limit)
      .lean(),
    Category.find({ name: { $regex: q, $options: 'i' } })
      .select('name slug image')
      .limit(4)
      .lean(),
  ]);

  res.json({
    products: products.map((p) => ({
      ...p,
      discount: calculateDiscount(p.price, p.compareAtPrice),
    })),
    categories,
    query: q,
  });
});

export default router;
