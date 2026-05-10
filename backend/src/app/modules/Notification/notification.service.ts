import { HydratedDocument, Model } from 'mongoose';
import { AppError } from '../../errors/AppError';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';

export class NotificationService {
  private notificationModel: Model<INotification>;

  constructor() {
    this.notificationModel = Notification;
  }

  async getNotificationsForUser(
    userId: string,
  ): Promise<HydratedDocument<INotification>[]> {
    return this.notificationModel
      .find({ user: userId, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(50) as unknown as Promise<HydratedDocument<INotification>[]>;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      user: userId,
      isRead: false,
      isDeleted: { $ne: true },
    });
  }

  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<HydratedDocument<INotification>> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }

    return notification as HydratedDocument<INotification>;
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { user: userId, isRead: false, isDeleted: { $ne: true } },
      { $set: { isRead: true } },
    );

    return { modifiedCount: result.modifiedCount };
  }

  async createNotification(
    data: Partial<INotification>,
  ): Promise<HydratedDocument<INotification>> {
    return this.notificationModel.create(data) as Promise<
      HydratedDocument<INotification>
    >;
  }

  async createBulkNotifications(
    notifications: Partial<INotification>[],
  ): Promise<HydratedDocument<INotification>[]> {
    return this.notificationModel.insertMany(
      notifications,
    ) as unknown as Promise<HydratedDocument<INotification>[]>;
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<HydratedDocument<INotification> | null> {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { isDeleted: true } },
      { new: true },
    ) as Promise<HydratedDocument<INotification> | null>;
  }
}

export const notificationService = new NotificationService();
