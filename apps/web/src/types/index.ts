export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  featured: boolean;
  productCount: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  images: string[];
  category: Category | string;
  brand?: string;
  sku: string;
  stock: number;
  inStock?: boolean;
  rating: number;
  reviewCount: number;
  specifications: { key: string; value: string }[];
  tags: string[];
  featured: boolean;
  flashDeal: boolean;
  flashDealEndsAt?: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  stock: number;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  wishlist?: string[];
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: Address;
}

export interface Review {
  _id: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export type PaymentMethod = 'bank_transfer' | 'mobile_payment' | 'pay_on_delivery' | 'whatsapp';
