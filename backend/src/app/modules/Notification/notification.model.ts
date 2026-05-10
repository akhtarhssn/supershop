import { Schema, model, HydratedDocument } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['order', 'payment', 'withdrawal', 'system', 'product'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

notificationSchema.statics.getNotificationsForUser = async function (userId: string) {
  return this.find({ user: userId, isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(50);
};

notificationSchema.statics.markAllAsRead = async function (userId: string) {
  return this.updateMany(
    { user: userId, isRead: false, isDeleted: { $ne: true } },
    { $set: { isRead: true } }
  );
};

notificationSchema.statics.createNotification = async function (data: Partial<INotification>) {
  return this.create(data);
};

const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema
);

export { Notification };