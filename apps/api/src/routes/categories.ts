import { Router, Response } from 'express';
import { Category } from '../models/Category.js';

const router = Router();

router.get('/', async (_req, res: Response) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ categories });
});

router.get('/featured', async (_req, res: Response) => {
  const categories = await Category.find({ featured: true }).sort({ name: 1 }).lean();
  res.json({ categories });
});

router.get('/:slug', async (req, res: Response) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  res.json({ category });
});

export default router;
