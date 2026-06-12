import { Router, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  label: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().default('Nigeria'),
  isDefault: z.boolean().optional(),
});

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3),
});

router.patch('/profile', authenticate, validateBody(updateProfileSchema), async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.user!._id, req.body, { new: true }).select('-password');
  res.json({ user });
});

router.post('/addresses', authenticate, validateBody(addressSchema), async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();
  res.json({ addresses: user.addresses });
});

router.delete('/addresses/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.addresses = user.addresses.filter((a) => a._id?.toString() !== req.params.id);
  await user.save();
  res.json({ addresses: user.addresses });
});

router.get('/wishlist', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).populate({
    path: 'wishlist',
    match: { active: true },
  });
  res.json({ wishlist: user?.wishlist || [] });
});

router.post('/wishlist/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const productId = product._id;
  const index = user.wishlist.findIndex((id) => id.toString() === productId.toString());

  if (index >= 0) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  res.json({ wishlist: user.wishlist, added: index < 0 });
});

router.post('/reviews', authenticate, validateBody(reviewSchema), async (req: AuthRequest, res: Response) => {
  const { productId, rating, title, comment } = req.body;

  const existing = await Review.findOne({ product: productId, user: req.user!._id });
  if (existing) {
    res.status(409).json({ message: 'You already reviewed this product' });
    return;
  }

  const review = await Review.create({
    product: productId,
    user: req.user!._id,
    userName: req.user!.name,
    rating,
    title,
    comment,
  });

  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats[0]) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }

  res.status(201).json({ review });
});

router.get('/reviews/:productId', async (req, res: Response) => {
  const reviews = await Review.find({ product: req.params.productId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  res.json({ reviews });
});

export default router;
