import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Bridal & Groom', 'Hair & Styling', 'Skin & Facials', 'Nail Art & Lashes', 'Appointments & Pricing'],
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FAQSchema.index({ category: 1, order: 1 });

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);
