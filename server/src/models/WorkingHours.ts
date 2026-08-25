import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkingHours extends Document {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime: string;  // HH:MM e.g. "09:30"
  closeTime: string; // HH:MM e.g. "20:30"
  breakStart?: string; // HH:MM e.g. "13:00"
  breakEnd?: string;   // HH:MM e.g. "14:00"
}

const WorkingHoursSchema = new Schema<IWorkingHours>(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
      unique: true,
    },
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, default: '09:00' },
    closeTime: { type: String, default: '20:30' },
    breakStart: { type: String, default: '13:30' },
    breakEnd: { type: String, default: '14:00' },
  },
  { timestamps: true }
);

export const WorkingHours = mongoose.model<IWorkingHours>('WorkingHours', WorkingHoursSchema);
