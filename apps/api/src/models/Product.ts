import mongoose, { Document, Schema } from 'mongoose';

export interface ISpecification {
  key: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  brand?: string;
  sku: string;
  stock: number;
  rating: number;
  reviewCount: number;
  specifications: ISpecification[];
  tags: string[];
  featured: boolean;
  flashDeal: boolean;
  flashDealEndsAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const specificationSchema = new Schema<ISpecification>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    specifications: [specificationSchema],
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    flashDeal: { type: Boolean, default: false },
    flashDealEndsAt: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, active: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ featured: 1 });
productSchema.index({ flashDeal: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
