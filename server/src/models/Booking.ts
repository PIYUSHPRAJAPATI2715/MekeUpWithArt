import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customer: mongoose.Types.ObjectId;
  itemType: 'service' | 'package';
  itemId: mongoose.Types.ObjectId;
  itemName: string;
  variantName?: string;
  price: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM (24h)
  duration: number; // minutes
  staff?: mongoose.Types.ObjectId;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: { type: String, enum: ['service', 'package'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    variantName: { type: String, default: '' },
    price: { type: Number, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:30"
    duration: { type: Number, required: true, default: 45 },
    staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Pending',
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    notes: { type: String, default: '' },
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

BookingSchema.index({ customer: 1 });
BookingSchema.index({ date: 1, timeSlot: 1, status: 1 });
BookingSchema.index({ bookingId: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
