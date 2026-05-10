import httpStatus from 'http-status';
import mongoose, { ObjectId, Types } from 'mongoose';
import { AppError } from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { Store } from '../Store/store.model';
import { withdrawalService } from '../Withdrawal/withdrawal.service';
import { notificationService } from '../Notification/notification.service';
import { User } from '../user/user.model';
import { IOrderProduct } from './order.interface';

const ADMIN_COMMISSION_RATE = 0.2;

export const createOrderIntoDB = async (
  userId: string | undefined,
  payload: IOrder,
) => {
  console.log('Received order payload:', JSON.stringify(payload, null, 2));
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let subtotal = 0;
    let adminCommission = 0;
    const orderProducts: IOrderProduct[] = [];
    const sellerEarningsMap: Record<string, number> = {};

    for (const item of payload.products) {
      const product = await Product.findById(item.product)
        .populate('store')
        .session(session);

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product with id ${item.product} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for ${product.name}`,
        );
      }

      product.stock -= item.quantity;
      await product.save({ session });

      const price = item.price || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      const sellerShare = itemTotal * (1 - ADMIN_COMMISSION_RATE);
      const itemCommission = itemTotal * ADMIN_COMMISSION_RATE;
      adminCommission += itemCommission;

      const sellerId = (product.store as any).seller;
      if (sellerId) {
        const sellerIdStr = sellerId.toString();
        sellerEarningsMap[sellerIdStr] =
          (sellerEarningsMap[sellerIdStr] || 0) + sellerShare;
      }

      orderProducts.push({
        product: product._id as Types.ObjectId,
        quantity: item.quantity,
        price: price,
        seller: sellerId as Types.ObjectId,
        sellerEarnings: sellerShare,
      });
    }

    const shipping = payload.shipping || 0;
    const tax = payload.tax || subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const orderData: Partial<IOrder> = {
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: userId ? new Types.ObjectId(userId) : undefined,
      email: payload.email,
      products: orderProducts,
      subtotal,
      shipping,
      tax,
      total,
      adminCommission,
      status: 'pending',
      paymentMethod: payload.paymentMethod || 'Credit Card',
      paymentStatus: 'pending',
      shippingAddress: payload.shippingAddress || {
        street: '123 Default St',
        city: 'Default City',
        state: 'Default State',
        zipCode: '00000',
        country: 'Default Country',
      },
      transactionId: payload.transactionId,
    };

    const result = await Order.create([orderData], { session });
    const order = result[0];

    for (const sellerId of Object.keys(sellerEarningsMap)) {
      const earnings = sellerEarningsMap[sellerId];
      await notificationService.createNotification({
        user: new Types.ObjectId(sellerId),
        type: 'order',
        title: 'New Order Received',
        message: `You have a new order #${order.orderNumber}! You earned $${earnings.toFixed(2)}`,
        orderId: order._id as Types.ObjectId,
      });
    }

    const adminUsers = await User.find({
      role: { $in: ['admin', 'superAdmin'] },
    }).session(session);
    for (const admin of adminUsers) {
      await notificationService.createNotification({
        user: new Types.ObjectId(admin._id.toString()),
        type: 'order',
        title: 'New Order Placed',
        message: `New order #${order.orderNumber} placed. Commission earned: $${adminCommission.toFixed(2)}`,
        orderId: order._id as Types.ObjectId,
      });
    }

    if (userId) {
      await notificationService.createNotification({
        user: new Types.ObjectId(userId),
        type: 'order',
        title: 'Order Placed Successfully',
        message: `Your order #${order.orderNumber} has been placed. Total: $${total.toFixed(2)}`,
        orderId: order._id as Types.ObjectId,
      });
    }

    await session.commitTransaction();
    await session.endSession();

    return order;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    await session.endSession();
    throw error;
  }
};

export const getAllOrdersFromDB = async (userId: ObjectId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Admin / SuperAdmin Logic
  if (['admin', 'superAdmin'].includes(user.role)) {
    return await Order.find({ isDeleted: false })
      .populate('user')
      .populate('products.product')
      .sort('-createdAt');
  }

  // Seller Logic
  if (user.role === 'seller') {
    const result = await Order.find({
      isDeleted: false,
      'products.seller': userId,
    })
      .populate('user')
      .populate('products.product')
      .sort('-createdAt');

    console.log('Seller Orders Found:', result.length);
    return result;
  }

  return [];
};

export const getMyOrdersFromDB = async (userId: string) => {
  const result = await Order.find({ user: new Types.ObjectId(userId) })
    .populate('products.product')
    .sort('-createdAt');
  return result;
};

export const updateOrderStatusInDB = async (
  id: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
) => {
  const order = await Order.findById(id).populate('user');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const oldStatus = order.status;
  order.status = status;
  await order.save();

  if (order.user) {
    let title = '';
    let message = '';

    switch (status) {
      case 'processing':
        title = 'Order Processing';
        message = `Your order #${order.orderNumber} is being processed.`;
        break;
      case 'shipped':
        title = 'Order Shipped';
        message = `Your order #${order.orderNumber} has been shipped.`;
        break;
      case 'delivered':
        title = 'Order Delivered';
        message = `Your order #${order.orderNumber} has been delivered. Thank you for shopping with us!`;
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = `Your order #${order.orderNumber} has been cancelled.`;
        break;
    }

    if (title && message) {
      await notificationService.createNotification({
        user: order.user._id,
        type: 'order',
        title,
        message,
        orderId: order._id as Types.ObjectId,
      });
    }
  }

  if (status === 'delivered' && oldStatus !== 'delivered') {
    for (const product of order.products as unknown as {
      seller?: Types.ObjectId;
      sellerEarnings?: number;
      price: number;
      quantity: number;
    }[]) {
      if (product.seller && product.sellerEarnings) {
        await withdrawalService.addSellerEarnings(
          product.seller.toString(),
          product.price * product.quantity,
          product.sellerEarnings,
        );
      }
    }
  }

  return order;
};

export const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id)
    .populate('user')
    .populate('products.product');
  return result;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusInDB,
};
