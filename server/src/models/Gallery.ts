import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  category: 'Hair' | 'Makeup' | 'Skin' | 'Nails' | 'Eyelash' | 'Salon' | 'Bridal' | 'Other';
  imageUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Hair', 'Makeup', 'Skin', 'Nails', 'Eyelash', 'Salon', 'Bridal', 'Other'],
      default: 'Salon',
    },
    imageUrl: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>('Gallery', GallerySchema);
