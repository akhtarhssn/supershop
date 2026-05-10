import { Model, Types, HydratedDocument } from 'mongoose';

export interface INotification {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  type: 'order' | 'payment' | 'withdrawal' | 'system' | 'product';
  title: string;
  message: string;
  orderId?: Types.ObjectId;
  isRead: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationMethods {
  markAsRead(): Promise<void>;
}

export interface NotificationModel extends Model<INotification> {}

export interface INotificationQuery {
  getNotificationsForUser(userId: string): Promise<HydratedDocument<INotification>[]>;
  markAllAsRead(userId: string): Promise<{ modifiedCount: number }>;
  createNotification(data: Partial<INotification>): Promise<HydratedDocument<INotification>>;
}