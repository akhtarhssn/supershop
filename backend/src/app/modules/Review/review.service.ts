import { IReview } from './review.interface';
import { Review } from './review.model';
import { Product } from '../Product/product.model';

const createReviewIntoDB = async (payload: IReview) => {
  const result = await Review.create(payload);

  // Update product average rating
  const allReviews = await Review.find({ product: payload.product });
  const averageRating =
    allReviews.reduce((sum, review) => sum + review.rating, 0) /
    allReviews.length;

  await Product.findByIdAndUpdate(payload.product, { rating: averageRating });

  return result;
};

const getProductReviewsFromDB = async (productId: string) => {
  const result = await Review.find({ product: productId }).populate('user');
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getProductReviewsFromDB,
};
