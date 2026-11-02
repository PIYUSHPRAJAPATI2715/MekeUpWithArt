import mongoose, { Schema, Document } from 'mongoose';

export interface IBroadcastLog {
  phone: string;
  name?: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  error?: string;
  timestamp: Date;
}

export interface IBroadcast extends Document {
  title: string;
  message: string;
  imageUrl?: string;
  targetAudience: 'ALL' | 'CUSTOMERS' | 'BOOKINGS' | 'CONTACTS' | 'CUSTOM';
  customNumbers?: string[];
  status: 'DRAFT' | 'SENDING' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED';
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  logs: IBroadcastLog[];
  sentAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastLogSchema = new Schema<IBroadcastLog>(
  {
    phone: { type: String, required: true },
    name: { type: String },
    status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' },
    error: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const BroadcastSchema = new Schema<IBroadcast>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    targetAudience: {
      type: String,
      enum: ['ALL', 'CUSTOMERS', 'BOOKINGS', 'CONTACTS', 'CUSTOM'],
      default: 'ALL',
    },
    customNumbers: [{ type: String }],
    status: {
      type: String,
      enum: ['DRAFT', 'SENDING', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED'],
      default: 'DRAFT',
    },
    recipientCount: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    logs: [BroadcastLogSchema],
    sentAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Broadcast = mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);
