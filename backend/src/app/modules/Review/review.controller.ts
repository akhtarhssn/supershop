import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const user = req.user._id;
  const result = await ReviewServices.createReviewIntoDB({ ...req.body, user });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ReviewServices.getProductReviewsFromDB(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getProductReviews,
};
