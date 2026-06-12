import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(generalLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'TechyMart API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techymart';
  await connectDB(uri);
  app.listen(PORT, () => {
    console.log(`TechyMart API running on port ${PORT}`);
  });
}

start();
