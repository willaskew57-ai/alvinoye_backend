import { Router } from 'express';
import { ReviewController } from './review.controller';
import { auth } from '../../../../middleware/auth';
import { createReviewValidationSchema } from './review.validation';
import validateRequest from '../../../../middleware/validate-request';
const router = Router();
// Customer submits review
router.post('/', auth('CUSTOMER'), validateRequest(createReviewValidationSchema), ReviewController.createReview);
// Get reviews for a specific driver0
router.get('/:id', ReviewController.getDriverReviews);
export const ReviewRoutes = router;
//# sourceMappingURL=review.routes.js.map