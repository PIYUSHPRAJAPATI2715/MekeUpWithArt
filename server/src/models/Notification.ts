import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user?: mongoose.Types.ObjectId; // null if global broadcast
  title: string;
  message: string;
  channel: 'Web' | 'Email' | 'WhatsApp';
  isRead: boolean;
  type?: 'booking' | 'system' | 'promotion';
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ['Web', 'Email', 'WhatsApp'], default: 'Web' },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['booking', 'system', 'promotion'], default: 'system' },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
