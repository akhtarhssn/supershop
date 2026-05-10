import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidation } from './review.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.buyer),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewControllers.createReview,
);

router.get('/:productId', ReviewControllers.getProductReviews);

export const ReviewRoutes = router;
