import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  photo: string;
  designation: string;
  bio: string;
  servicesHandled: mongoose.Types.ObjectId[];
  workingDays: string[]; // ['Monday', 'Tuesday', ...]
  workingHours: {
    start: string; // "09:00"
    end: string;   // "20:00"
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    servicesHandled: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    workingDays: [{ type: String }],
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '20:00' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema);
