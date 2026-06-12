import { Router, Response } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { AuthRequest, authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { slugify } from '../utils/helpers.js';

const router = Router();

router.use(authenticate, requireAdmin);

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.number().min(0),
  compareAtPrice: z.number().optional(),
  images: z.array(z.string()).min(1),
  category: z.string(),
  brand: z.string().optional(),
  sku: z.string(),
  stock: z.number().min(0),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  flashDeal: z.boolean().optional(),
  flashDealEndsAt: z.string().optional(),
  active: z.boolean().optional(),
});

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string(),
  icon: z.string().optional(),
  featured: z.boolean().optional(),
});

const orderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

// Analytics
router.get('/analytics', async (_req, res: Response) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalOrders, totalRevenue, totalCustomers, totalProducts, recentOrders, popularProducts] =
    await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ active: true }),
      Order.find({ createdAt: { $gte: thirtyDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ]);

  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    stats: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      totalProducts,
    },
    recentOrders,
    popularProducts,
    monthlyRevenue,
  });
});

// Products CRUD
router.get('/products', async (_req, res: Response) => {
  const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 }).lean();
  res.json({ products });
});

router.post('/products', validateBody(productSchema), async (req, res: Response) => {
  const slug = slugify(req.body.name);
  const product = await Product.create({ ...req.body, slug });
  await Category.findByIdAndUpdate(req.body.category, { $inc: { productCount: 1 } });
  res.status(201).json({ product });
});

router.put('/products/:id', validateBody(productSchema.partial()), async (req, res: Response) => {
  const updates = { ...req.body };
  if (updates.name) updates.slug = slugify(updates.name);
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json({ product });
});

router.delete('/products/:id', async (req, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
  res.json({ message: 'Product deleted' });
});

// Categories CRUD
router.get('/categories', async (_req, res: Response) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ categories });
});

router.post('/categories', validateBody(categorySchema), async (req, res: Response) => {
  const slug = slugify(req.body.name);
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ category });
});

router.put('/categories/:id', validateBody(categorySchema.partial()), async (req, res: Response) => {
  const updates = { ...req.body };
  if (updates.name) updates.slug = slugify(updates.name);
  const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  res.json({ category });
});

router.delete('/categories/:id', async (req, res: Response) => {
  const count = await Product.countDocuments({ category: req.params.id });
  if (count > 0) {
    res.status(400).json({ message: 'Cannot delete category with products' });
    return;
  }
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
});

// Orders
router.get('/orders', async (_req, res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email').lean();
  res.json({ orders });
});

router.patch('/orders/:id', validateBody(orderStatusSchema), async (req, res: Response) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  res.json({ order });
});

// Customers
router.get('/customers', async (_req, res: Response) => {
  const customers = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ customers });
});

export default router;
