import { Router } from 'express';
import {
  faqValidation,
  contentCreateValidation,
  contentUpdateValidation,
} from './settings.validation';
import { auth } from '../../../../middleware/auth'; // Assume this middleware exists
import validateRequest from '../../../../middleware/validate-request';
import { SettingsController } from './settings.controller';
import { USER_ROLE } from '../user/user.interface';

const router = Router();

//** ----------- FAQ Routes ------------
router.post(
  '/faq/create',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(faqValidation.create),
  SettingsController.createFaq
);

router.get('/faq/get-all', SettingsController.getFaqs);

router.patch(
  '/faq/update/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(faqValidation.update),
  SettingsController.updateFaq
);

router.get(
  '/faq/get/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  SettingsController.getSingleFaqs
);
router.delete(
  '/faq/delete/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  SettingsController.deleteFaq
);

// ** --------------- Terms Routes ----------
router.post(
  '/terms/create',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(contentCreateValidation),
  SettingsController.createTerms
);
router.get('/terms/get', SettingsController.getSingleTerms);
router.patch(
  '/terms/update/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(contentUpdateValidation),
  SettingsController.updateTerms
);

//** ---------------- Privacy Routes ---------
router.post(
  '/privacy/create',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(contentCreateValidation),
  SettingsController.createPrivacy
);
router.get('/privacy/get', SettingsController.getSinglePrivacy);
router.patch(
  '/privacy/update/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(contentUpdateValidation),
  SettingsController.updatePrivacy
);

export const SettingsRoutes = router;
