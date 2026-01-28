import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';
import { ParcelControllers } from './parcel.controller';
import { ParcelValidations } from './parcel.validation';
import { getLocalFileUrl, upload } from '../../../../utils/fileUploadHelper';

const router = express.Router();

// parcel.route.ts

router.post(
  '/create',
  auth(USER_ROLE.CUSTOMER),
  upload.fields([{ name: 'parcel_images', maxCount: 5 }]), // Allow up to 5 images
  (req: Request, res: Response, next: NextFunction) => {
    // 1. Parse JSON data
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    // 2. Map file paths to local URLs
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[] | undefined;
    };
    if (files?.parcel_images) {
      req.body.parcel_images = files.parcel_images.map((file) =>
        getLocalFileUrl(file.path)
      );
    }

    next();
  },
  validateRequest(ParcelValidations.createParcelValidationSchema),
  ParcelControllers.createParcel
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.CUSTOMER),
  upload.fields([{ name: 'parcel_images', maxCount: 5 }]),
  (req: Request, res: Response, next: NextFunction) => {
    // Parse JSON string from form-data
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    // Convert newly uploaded files to local URLs
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[] | undefined;
    };
    if (files?.parcel_images) {
      req.body.parcel_images = files.parcel_images.map((file) =>
        getLocalFileUrl(file.path)
      );
    }
    next();
  },
  validateRequest(ParcelValidations.updateParcelValidationSchema),
  ParcelControllers.updateParcel
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
  '/reject/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  validateRequest(ParcelValidations.rejectParcelValidationSchema),
  ParcelControllers.rejectParcel
);

router.patch(
  '/request-for-price/:id',
  auth(USER_ROLE.CUSTOMER),
  ParcelControllers.requestForPrice
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
  ParcelControllers.acceptPrice
);

router.patch(
  '/reject-price/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.CUSTOMER),
  ParcelControllers.rejectPrice
);

export const ParcelRoutes = router;
