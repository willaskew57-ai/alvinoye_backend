import express from 'express';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';
import { ParcelControllers } from './parcel.controller';
import { ParcelValidations } from './parcel.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.CUSTOMER, USER_ROLE.SUPER_ADMIN),
  validateRequest(ParcelValidations.createParcelValidationSchema),
  ParcelControllers.createParcel
);

router.get(
  '/get-all',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.DRIVER,
    USER_ROLE.CUSTOMER
  ),
  ParcelControllers.getAllParcels
);

router.get(
  '/get-my-parcels',
  auth(USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  ParcelControllers.getMyParcels
);

router.get(
  '/get/:id',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.DRIVER,
    USER_ROLE.CUSTOMER
  ),
  ParcelControllers.getSingleParcel
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.updateParcelValidationSchema),
  ParcelControllers.updateParcel
);

router.patch(
  '/reject/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  validateRequest(ParcelValidations.rejectParcelValidationSchema),
  ParcelControllers.rejectParcel
);

// ** ------- Negotiation Flow -------

// Admin sets first price
router.post(
  '/propose-price',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(ParcelValidations.createPriceRequestValidationSchema),
  ParcelControllers.proposePrice
);

// Customer Reject & Counter
router.patch(
  '/reject-and-counter/:id',
  auth(USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.customerRejectAndCounterValidationSchema),
  ParcelControllers.rejectAndCounter
);

// Admin Reject & Final Price
router.patch(
  '/final-offer/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(ParcelValidations.adminRejectAndFinalOfferValidationSchema),
  ParcelControllers.adminFinalOffer
);

// Simple Accept or Reject (Final choice)
router.patch(
  '/accept-price/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.CUSTOMER),
  validateRequest(ParcelValidations.acceptPriceRequestValidationSchema),
  ParcelControllers.acceptPrice
);

export const ParcelRoutes = router;
