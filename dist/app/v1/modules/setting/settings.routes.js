import { Router } from 'express';
import { faqValidation, contentValidation } from './settings.validation';
import { auth } from '../../../../middleware/auth'; // Assume this middleware exists
import validateRequest from '../../../../middleware/validate-request';
import { SettingsController } from './settings.controller';
const router = Router();
// FAQ Routes
router.get('/faq', SettingsController.getFaqs);
// router.post(
//   '/faq',
//   auth('ADMIN'),
//   validateRequest(faqValidation.create),
//   SettingsController.ma
// );
// Terms Routes
router.get('/terms', SettingsController.getTerms);
router.post('/terms', auth('ADMIN'), validateRequest(contentValidation), SettingsController.manageTerms);
// Privacy Routes
router.get('/privacy', SettingsController.getPrivacy);
router.post('/privacy', auth('ADMIN'), validateRequest(contentValidation), SettingsController.managePrivacy);
export const SettingsRoutes = router;
//# sourceMappingURL=settings.routes.js.map