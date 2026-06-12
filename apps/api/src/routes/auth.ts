import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../models/User.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(128),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(6).max(128),
});

function signToken(userId: string): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

router.post('/register', authLimiter, validateBody(registerSchema), async (req, res: Response) => {
  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, phone });
  const token = signToken(user._id.toString());

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

router.post('/login', authLimiter, validateBody(loginSchema), async (req, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signToken(user._id.toString());
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
  });
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

router.post('/forgot-password', authLimiter, validateBody(forgotSchema), async (req, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.json({ message: 'If that email exists, a reset link has been sent.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 3600000);
  await user.save();

  res.json({ message: 'If that email exists, a reset link has been sent.', resetToken: token });
});

router.post('/reset-password', authLimiter, validateBody(resetSchema), async (req, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: 'Invalid or expired reset token' });
    return;
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

export default router;
