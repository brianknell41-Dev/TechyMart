import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { slugify } from './helpers.js';

const CATEGORIES = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    featured: true,
  },
  {
    name: 'Smart Watches',
    slug: 'smart-watches',
    description: 'Wearable tech for fitness and productivity',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    featured: true,
  },
  {
    name: 'Solar Solutions',
    slug: 'solar-solutions',
    description: 'Solar panels, inverters and renewable energy',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    featured: true,
  },
  {
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    description: 'Air fryers, ovens and smart kitchen tools',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    featured: true,
  },
  {
    name: 'Home Improvement',
    slug: 'home-improvement',
    description: 'Tools and gadgets for your home',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    featured: true,
  },
  {
    name: 'Power & Charging',
    slug: 'power-charging',
    description: 'Power banks, chargers and accessories',
    image: 'https://images.unsplash.com/photo-1609091839311-9f294f1e2f2f?w=800&q=80',
    featured: true,
  },
];

const PRODUCTS = [
  {
    name: 'UltraCharge 20000mAh Power Bank',
    price: 18500,
    compareAtPrice: 24000,
    category: 'power-charging',
    brand: 'TechyMart',
    sku: 'TM-PB-001',
    stock: 45,
    rating: 4.8,
    reviewCount: 128,
    featured: true,
    flashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1609091839311-9f294f1e2f2f?w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd9777362f6?w=800&q=80',
    ],
    shortDescription: 'Fast-charging portable power with dual USB-C ports.',
    description:
      'Stay powered anywhere with the UltraCharge 20000mAh Power Bank. Features 65W PD fast charging, dual USB-C ports, LED battery indicator, and premium build quality. Perfect for phones, tablets, and laptops.',
    specifications: [
      { key: 'Capacity', value: '20000mAh' },
      { key: 'Output', value: '65W PD' },
      { key: 'Ports', value: '2x USB-C, 1x USB-A' },
      { key: 'Weight', value: '380g' },
    ],
    tags: ['power bank', 'charger', 'portable'],
  },
  {
    name: 'SmartFit Pro Watch',
    price: 45000,
    compareAtPrice: 62000,
    category: 'smart-watches',
    brand: 'SmartFit',
    sku: 'TM-SW-001',
    stock: 32,
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    ],
    shortDescription: 'Advanced fitness tracking with AMOLED display.',
    description:
      'The SmartFit Pro Watch combines style with functionality. Track heart rate, SpO2, sleep, and 100+ workout modes. Water resistant to 5ATM with 7-day battery life.',
    specifications: [
      { key: 'Display', value: '1.4" AMOLED' },
      { key: 'Battery', value: '7 days' },
      { key: 'Water Resistance', value: '5ATM' },
      { key: 'GPS', value: 'Built-in' },
    ],
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    name: 'SolarMax 300W Panel Kit',
    price: 125000,
    compareAtPrice: 155000,
    category: 'solar-solutions',
    brand: 'SolarMax',
    sku: 'TM-SP-001',
    stock: 15,
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80',
    ],
    shortDescription: 'High-efficiency monocrystalline solar panel kit.',
    description:
      'Harness clean energy with the SolarMax 300W Panel Kit. Includes mounting brackets, cables, and 25-year performance warranty. Ideal for homes and small businesses.',
    specifications: [
      { key: 'Power Output', value: '300W' },
      { key: 'Efficiency', value: '21.5%' },
      { key: 'Type', value: 'Monocrystalline' },
      { key: 'Warranty', value: '25 years' },
    ],
    tags: ['solar', 'renewable', 'energy'],
  },
  {
    name: 'AirCrisp 5L Digital Air Fryer',
    price: 52000,
    compareAtPrice: 68000,
    category: 'kitchen-appliances',
    brand: 'AirCrisp',
    sku: 'TM-AF-001',
    stock: 28,
    rating: 4.6,
    reviewCount: 156,
    featured: true,
    flashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1586208958839-3c5c4c4c4c4c?w=800&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    ],
    shortDescription: 'Healthy cooking with 8 preset programs.',
    description:
      'Cook with up to 85% less oil using the AirCrisp 5L Digital Air Fryer. Features touch controls, 8 preset programs, non-stick basket, and rapid air circulation technology.',
    specifications: [
      { key: 'Capacity', value: '5 Liters' },
      { key: 'Power', value: '1700W' },
      { key: 'Programs', value: '8 presets' },
      { key: 'Timer', value: '60 minutes' },
    ],
    tags: ['air fryer', 'kitchen', 'cooking'],
  },
  {
    name: 'Wireless Noise-Cancel Earbuds Pro',
    price: 28000,
    compareAtPrice: 38000,
    category: 'electronics',
    brand: 'SoundWave',
    sku: 'TM-EB-001',
    stock: 60,
    rating: 4.5,
    reviewCount: 203,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
    ],
    shortDescription: 'Premium ANC earbuds with 30hr battery.',
    description:
      'Immerse yourself in crystal-clear audio with active noise cancellation, transparency mode, and IPX5 water resistance. Includes wireless charging case.',
    specifications: [
      { key: 'Battery', value: '30 hours total' },
      { key: 'ANC', value: 'Active' },
      { key: 'Bluetooth', value: '5.3' },
      { key: 'Water Resistance', value: 'IPX5' },
    ],
    tags: ['earbuds', 'audio', 'wireless'],
  },
  {
    name: 'SmartHome Hub Mini',
    price: 35000,
    compareAtPrice: 42000,
    category: 'electronics',
    brand: 'HomeLink',
    sku: 'TM-SH-001',
    stock: 40,
    rating: 4.4,
    reviewCount: 67,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
      'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80',
    ],
    shortDescription: 'Control all your smart devices from one hub.',
    description:
      'The SmartHome Hub Mini connects and controls 100+ compatible devices. Voice assistant ready, app control, automation scenes, and energy monitoring.',
    specifications: [
      { key: 'Connectivity', value: 'Wi-Fi, Zigbee, Bluetooth' },
      { key: 'Devices', value: '100+ compatible' },
      { key: 'Voice', value: 'Alexa & Google' },
      { key: 'Display', value: '2.4" touchscreen' },
    ],
    tags: ['smart home', 'automation', 'hub'],
  },
  {
    name: 'PureFlow 1000W Inverter',
    price: 89000,
    compareAtPrice: 110000,
    category: 'solar-solutions',
    brand: 'PureFlow',
    sku: 'TM-INV-001',
    stock: 20,
    rating: 4.7,
    reviewCount: 34,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac71?w=800&q=80',
    ],
    shortDescription: 'Pure sine wave inverter for reliable backup power.',
    description:
      'Keep your appliances running during outages with the PureFlow 1000W Pure Sine Wave Inverter. Silent operation, overload protection, and LCD display.',
    specifications: [
      { key: 'Power', value: '1000W continuous' },
      { key: 'Wave Type', value: 'Pure Sine' },
      { key: 'Input', value: '12V DC' },
      { key: 'Efficiency', value: '90%+' },
    ],
    tags: ['inverter', 'backup', 'power'],
  },
  {
    name: 'CompactBake Mini Oven 20L',
    price: 38000,
    compareAtPrice: 48000,
    category: 'kitchen-appliances',
    brand: 'BakePro',
    sku: 'TM-MO-001',
    stock: 25,
    rating: 4.3,
    reviewCount: 78,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7ddd8d2a9a56?w=800&q=80',
    ],
    shortDescription: 'Versatile mini oven for baking and grilling.',
    description:
      'The CompactBake Mini Oven delivers professional results in a compact footprint. Convection heating, adjustable temperature up to 250°C, and timer function.',
    specifications: [
      { key: 'Capacity', value: '20 Liters' },
      { key: 'Power', value: '1380W' },
      { key: 'Temperature', value: '100-250°C' },
      { key: 'Functions', value: 'Bake, Grill, Toast' },
    ],
    tags: ['oven', 'baking', 'kitchen'],
  },
  {
    name: 'ProTool Cordless Drill Set',
    price: 42000,
    compareAtPrice: 55000,
    category: 'home-improvement',
    brand: 'ProTool',
    sku: 'TM-DR-001',
    stock: 35,
    rating: 4.6,
    reviewCount: 91,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80',
    ],
    shortDescription: '20V cordless drill with 50-piece accessory kit.',
    description:
      'Tackle any DIY project with the ProTool Cordless Drill. 20V lithium battery, 2-speed gearbox, LED work light, and comprehensive 50-piece bit set included.',
    specifications: [
      { key: 'Voltage', value: '20V' },
      { key: 'Chuck', value: '13mm keyless' },
      { key: 'Speed', value: '0-1500 RPM' },
      { key: 'Kit', value: '50 pieces' },
    ],
    tags: ['drill', 'tools', 'DIY'],
  },
  {
    name: 'GaN 65W Fast Charger',
    price: 12000,
    compareAtPrice: 16000,
    category: 'power-charging',
    brand: 'ChargeMax',
    sku: 'TM-CH-001',
    stock: 80,
    rating: 4.8,
    reviewCount: 245,
    featured: true,
    flashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd9777362f6?w=800&q=80',
    ],
    shortDescription: 'Compact GaN charger for all your devices.',
    description:
      'Charge laptops, phones, and tablets simultaneously with this ultra-compact GaN 65W charger. PD 3.0, QC 4.0 compatible with foldable plug design.',
    specifications: [
      { key: 'Output', value: '65W max' },
      { key: 'Technology', value: 'GaN' },
      { key: 'Ports', value: '2x USB-C' },
      { key: 'Size', value: '50% smaller than standard' },
    ],
    tags: ['charger', 'GaN', 'fast charging'],
  },
  {
    name: 'LED Smart Bulb 4-Pack',
    price: 8500,
    compareAtPrice: 12000,
    category: 'electronics',
    brand: 'LumiSmart',
    sku: 'TM-LB-001',
    stock: 100,
    rating: 4.2,
    reviewCount: 112,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
    ],
    shortDescription: 'Wi-Fi enabled color-changing smart bulbs.',
    description:
      'Transform your space with 16 million colors, scheduling, voice control, and energy-efficient LED technology. Easy setup via mobile app.',
    specifications: [
      { key: 'Base', value: 'E27' },
      { key: 'Wattage', value: '9W (60W equivalent)' },
      { key: 'Colors', value: '16 million' },
      { key: 'Lifespan', value: '25000 hours' },
    ],
    tags: ['smart bulb', 'lighting', 'LED'],
  },
  {
    name: 'Portable Blender Pro',
    price: 15000,
    compareAtPrice: 20000,
    category: 'kitchen-appliances',
    brand: 'BlendGo',
    sku: 'TM-BL-001',
    stock: 55,
    rating: 4.4,
    reviewCount: 88,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56e?w=800&q=80',
    ],
    shortDescription: 'USB rechargeable personal blender for smoothies on the go.',
    description:
      'Make fresh smoothies anywhere with the Portable Blender Pro. 400ml capacity, 6-blade system, USB-C charging, and BPA-free materials.',
    specifications: [
      { key: 'Capacity', value: '400ml' },
      { key: 'Battery', value: '2000mAh' },
      { key: 'Blades', value: '6 stainless steel' },
      { key: 'Charge Time', value: '3 hours' },
    ],
    tags: ['blender', 'portable', 'kitchen'],
  },
];

const REVIEWS = [
  { productSku: 'TM-PB-001', userName: 'Ada O.', rating: 5, title: 'Excellent power bank!', comment: 'Charges my laptop and phone simultaneously. Highly recommend!' },
  { productSku: 'TM-SW-001', userName: 'Chidi M.', rating: 5, title: 'Best smartwatch I have owned', comment: 'Battery lasts a full week and the fitness tracking is accurate.' },
  { productSku: 'TM-AF-001', userName: 'Fatima A.', rating: 4, title: 'Great air fryer', comment: 'Makes crispy food with minimal oil. Easy to clean too.' },
  { productSku: 'TM-EB-001', userName: 'James K.', rating: 5, title: 'Amazing sound quality', comment: 'The noise cancellation is top-notch for the price.' },
  { productSku: 'TM-CH-001', userName: 'Blessing E.', rating: 5, title: 'Super fast charging', comment: 'Charges my MacBook and iPhone at the same time. Love it!' },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techymart';
  await connectDB(uri);

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const customerPassword = await bcrypt.hash('Customer@123', 12);

  const admin = await User.create({
    name: 'TechyMart Admin',
    email: 'admin@techymart.com',
    password: adminPassword,
    role: 'admin',
    phone: '+2348000000001',
  });

  const customer = await User.create({
    name: 'Demo Customer',
    email: 'customer@techymart.com',
    password: customerPassword,
    role: 'customer',
    phone: '+2348000000002',
  });

  const categories = await Category.insertMany(
    CATEGORIES.map((c) => ({ ...c, productCount: 0 }))
  );

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  const flashDealEndsAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  const products = await Product.insertMany(
    PRODUCTS.map((p) => ({
      ...p,
      slug: slugify(p.name),
      category: categoryMap[p.category],
      flashDealEndsAt: p.flashDeal ? flashDealEndsAt : undefined,
      active: true,
    }))
  );

  for (const cat of categories) {
    const count = products.filter((p) => p.category.toString() === cat._id.toString()).length;
    await Category.findByIdAndUpdate(cat._id, { productCount: count });
  }

  const productMap = Object.fromEntries(products.map((p) => [p.sku, p]));

  for (const r of REVIEWS) {
    const product = productMap[r.productSku];
    if (product) {
      await Review.create({
        product: product._id,
        user: customer._id,
        userName: r.userName,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verified: true,
      });
    }
  }

  console.log('Seed completed!');
  console.log('Admin: admin@techymart.com / Admin@123');
  console.log('Customer: customer@techymart.com / Customer@123');
  console.log(`Created ${categories.length} categories, ${products.length} products`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
