import { Router } from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../../../middleware/auth';
import { createReviewValidationSchema } from './review.validation';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';

const router = Router();

router.post(
  '/create',
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createReviewValidationSchema),
  ReviewController.createReview
);
router.get('/get/:id', auth(), ReviewController.getSingleReview);

router.get('/get-driver-review', auth(USER_ROLE.DRIVER), ReviewController.getDriverReviews);

router.get('/get-customer-review', auth(USER_ROLE.CUSTOMER), ReviewController.getCustomerReviews);

export const ReviewRoutes = router;
