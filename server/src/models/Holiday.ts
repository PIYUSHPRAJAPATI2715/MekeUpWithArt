import mongoose, { Schema, Document } from 'mongoose';

export interface IHoliday extends Document {
  date: string; // YYYY-MM-DD
  title: string;
  isFullDay: boolean;
  notes?: string;
}

const HolidaySchema = new Schema<IHoliday>(
  {
    date: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    isFullDay: { type: Boolean, default: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Holiday = mongoose.model<IHoliday>('Holiday', HolidaySchema);
