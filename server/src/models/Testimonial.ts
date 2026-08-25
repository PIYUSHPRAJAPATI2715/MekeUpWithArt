import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  customerName: string;
  rating: number;
  review: string;
  photo?: string;
  status: 'Approved' | 'Pending';
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    photo: { type: String, default: '' },
    status: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
