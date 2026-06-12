# TechyMart

Premium e-commerce marketplace built with the MERN stack — **Next.js**, **Express**, **MongoDB**, and **React**.

## Features

- **Storefront**: Hero, categories, featured products, flash deals, reviews, newsletter
- **Product catalog**: Search, filters, sorting, pagination, product detail with zoom
- **Cart & checkout**: Quantity controls, save for later, coupons, multiple payment methods
- **Payments**: Bank transfer, mobile payment, pay on delivery, WhatsApp order
- **Auth**: Register, login, password recovery, JWT authentication
- **Account**: Profile, orders, wishlist, saved addresses
- **Admin panel**: Products, categories, orders, customers, analytics dashboard
- **Performance**: Image optimization, lazy loading, ISR caching, code splitting
- **Security**: bcrypt passwords, Helmet, rate limiting, Zod validation
- **SEO**: Metadata, Open Graph, JSON-LD product schema, sitemap, robots.txt

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| State | Zustand (cart, auth, search) |
| Auth | JWT + bcrypt |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Install dependencies

```bash
cd techymart
npm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/api/.env` — set `MONGODB_URI` and a strong `JWT_SECRET`.

### 3. Seed the database

```bash
npm run seed
```

This creates sample products, categories, and demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@techymart.com | Admin@123 |
| Customer | customer@techymart.com | Customer@123 |

### 4. Start development servers

```bash
npm run dev
```

- **Storefront**: http://localhost:3000
- **API**: http://localhost:5000

## Project Structure

```
techymart/
├── apps/
│   ├── api/          # Express REST API
│   │   └── src/
│   │       ├── models/
│   │       ├── routes/
│   │       ├── middleware/
│   │       └── utils/
│   └── web/          # Next.js storefront + admin
│       └── src/
│           ├── app/
│           ├── components/
│           ├── lib/
│           └── store/
└── package.json      # Monorepo root
```

## Coupon Codes (Demo)

- `TECHY10` — 10% off
- `WELCOME15` — 15% off
- `SAVE500` — ₦500 off

## Production Deployment

1. Set production environment variables
2. Build: `npm run build`
3. Start: `npm run start`
4. Deploy frontend (Vercel) and API (Railway/Render) separately
5. Connect MongoDB Atlas and configure `CLIENT_URL` / `NEXT_PUBLIC_API_URL`

## Cloud Image Storage

Product images use URLs (Unsplash in seed data). For production uploads, configure Cloudinary env vars in `apps/api/.env` and extend the admin product form with file upload.

## License

Private — TechyMart © 2026
