import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';
import { EmailServices } from '../Email/email.service';
import { Order } from './order.model';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const payload = {
    ...req.body,
    email: user.email,
  };

  const result = await OrderServices.createOrderIntoDB(
    user._id.toString(),
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const user_id = await User.findById(req.user.userId);
  if (!user_id) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await OrderServices.getAllOrdersFromDB(user_id._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await OrderServices.getMyOrdersFromDB(user._id.toString());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My orders retrieved successfully',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await OrderServices.updateOrderStatusInDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.getSingleOrderFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const downloadInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id)
    .populate('user')
    .populate('products.product');

  if (!order) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: 'Order not found',
    });
  }

  const pdfBuffer = await EmailServices.generateInvoicePDF(order);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=invoice_${order.orderNumber}.pdf`,
  );
  res.send(pdfBuffer);
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  downloadInvoice,
};
