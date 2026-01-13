import express from 'express';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';
import { ParcelControllers } from './parcel.controller';
import { ParcelValidations } from './parcel.validation';

const router = express.Router();

// --- Booking & Discovery ---

router.post(
  '/create-parcel',
  auth(USER_ROLE.CUSTOMER, USER_ROLE.SUPER_ADMIN),
  validateRequest(ParcelValidations.createParcelValidationSchema),
  ParcelControllers.createParcel
);

router.get(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER),
  ParcelControllers.getAllParcels
);

router.get(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER),
  ParcelControllers.getSingleParcel
);

router.patch(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.updateParcelValidationSchema),
  ParcelControllers.updateParcel
);

// --- Price Negotiation Routes ---

// Admin or Customer proposes a price
router.post(
  '/propose-price',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.createPriceRequestValidationSchema),
  ParcelControllers.proposePrice
);

// Accept or Reject a specific proposal (id = price_request_id)
router.patch(
  '/respond-price/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.respondPriceRequestValidationSchema),
  ParcelControllers.respondToPrice
);

// Get the full negotiation log for a specific parcel (id = parcel_id)
router.get(
  '/price-history/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  ParcelControllers.getPriceHistory
);

export const ParcelRoutes = router;