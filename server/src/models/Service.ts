import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceVariant {
  name: string; // e.g. Basic, Premium, Luxury
  price: number;
  duration: number; // minutes
}

export interface IService extends Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  duration: number; // minutes
  benefits: string[];
  images: string[];
  variants?: IServiceVariant[];
  status: 'Active' | 'Inactive';
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Bridal Makeup', 'Groom Makeup', 'Hair Art', 'Nail Art', 'Skin', 'Eyelashes', 'Hair', 'Makeup', 'Nails', 'Eyelash', 'Other'],
      default: 'Bridal Makeup',
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    duration: { type: Number, required: true, default: 30 }, // in minutes
    benefits: [{ type: String }],
    images: [{ type: String }],
    variants: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
      },
    ],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ category: 1, status: 1 });

export const Service = mongoose.model<IService>('Service', ServiceSchema);
