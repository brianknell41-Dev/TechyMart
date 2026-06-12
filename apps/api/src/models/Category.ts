import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  featured: boolean;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, trim: true },
    image: { type: String, required: true },
    icon: { type: String },
    featured: { type: Boolean, default: false },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ featured: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
