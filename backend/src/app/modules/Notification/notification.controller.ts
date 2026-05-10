import { Request, Response } from 'express';
import { notificationService } from './notification.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

export const NotificationController = {
  getMyNotifications: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const notifications =
      await notificationService.getNotificationsForUser(userId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: notifications,
    });
  },

  markAsRead: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const notification = await notificationService.markAsRead(
      userId,
      notificationId,
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: notification,
    });
  },

  markAllAsRead: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const result = await notificationService.markAllAsRead(userId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All notifications marked as read',
      data: result,
    });
  },

  getUnreadCount: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const count = await notificationService.getUnreadCount(userId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: { unreadCount: count },
    });
  },
};
