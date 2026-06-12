import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { generateOrderNumber, applyCoupon } from '../utils/helpers.js';

const router = Router();

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).max(99),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  shippingAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string().default('Nigeria'),
    })
    .optional(),
  paymentMethod: z.enum(['bank_transfer', 'mobile_payment', 'pay_on_delivery', 'whatsapp']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

const couponSchema = z.object({
  code: z.string(),
  subtotal: z.number().min(0),
});

router.post('/validate-coupon', validateBody(couponSchema), (req, res: Response) => {
  const { code, subtotal } = req.body;
  const result = applyCoupon(code, subtotal);
  if (!result.valid) {
    res.status(400).json({ message: 'Invalid coupon code', valid: false });
    return;
  }
  res.json({ valid: true, discount: result.discount });
});

router.post('/', optionalAuth, validateBody(createOrderSchema), async (req: AuthRequest, res: Response) => {
  const { items, guestName, guestEmail, guestPhone, shippingAddress, paymentMethod, couponCode, notes } =
    req.body;

  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, active: true });

  if (products.length !== items.length) {
    res.status(400).json({ message: 'One or more products not found' });
    return;
  }

  const orderItems: {
    product: import('mongoose').Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) continue;
    if (product.stock < item.quantity) {
      res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      return;
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
    });
  }

  if (orderItems.length !== items.length) {
    res.status(400).json({ message: 'One or more products not found' });
    return;
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (couponCode) {
    const couponResult = applyCoupon(couponCode, subtotal);
    if (couponResult.valid) discount = couponResult.discount;
  }

  const shipping = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal - discount + shipping;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user?._id,
    guestName,
    guestEmail,
    guestPhone,
    items: orderItems,
    shippingAddress,
    subtotal,
    discount,
    couponCode: couponCode?.toUpperCase(),
    shipping,
    total,
    paymentMethod,
    notes,
    status: 'pending',
    paymentStatus: paymentMethod === 'pay_on_delivery' ? 'pending' : 'pending',
  });

  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  res.status(201).json({ order });
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 }).lean();
  res.json({ orders });
});

router.get('/:orderNumber', optionalAuth, async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  if (order.user && req.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  res.json({ order });
});

export default router;
