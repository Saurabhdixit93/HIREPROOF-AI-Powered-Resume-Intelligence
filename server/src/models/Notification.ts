import mongoose, { Schema } from 'mongoose';

export interface INotification {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: string;
  actionUrl?: string;
  jobId?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['success', 'info', 'warning', 'error'], default: 'info' },
  action: { type: String },
  actionUrl: { type: String },
  jobId: { type: String },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

// Index for getting recent unread notifications quickly
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
