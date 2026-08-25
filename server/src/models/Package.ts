import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  slug: string;
  description: string;
  servicesIncluded: mongoose.Types.ObjectId[];
  originalPrice: number;
  discountPrice: number;
  duration: number; // in minutes
  validityDays?: number;
  benefits: string[];
  image: string;
  status: 'Active' | 'Inactive';
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    servicesIncluded: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    originalPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    duration: { type: Number, required: true }, // total duration in minutes
    validityDays: { type: Number, default: 30 },
    benefits: [{ type: String }],
    image: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PackageSchema.index({ slug: 1 });

export const Package = mongoose.model<IPackage>('Package', PackageSchema);
