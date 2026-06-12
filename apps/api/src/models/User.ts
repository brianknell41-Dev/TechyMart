import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: 'Nigeria' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
