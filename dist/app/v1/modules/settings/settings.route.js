import express from 'express';
// ** import local files
import validateRequest from '../../../../middleware/validate-request';
import { SettingsControllers } from './settings.controller';
import { SettingValidation } from './settings.zod-validation';
const router = express.Router();
// ** -------- Privacy Policy Routes -------- ** //
router.post('/privacy-policy/create', validateRequest(SettingValidation.CreatePrivacyPolicyValidationSchema), SettingsControllers.CreatePrivacyPolicy);
router.get('/privacy-policy', SettingsControllers.GetPrivacyPolicy);
router.patch('/privacy-policy/:id', validateRequest(SettingValidation.UpdatePrivacyPolicyValidationSchema), SettingsControllers.UpdatePrivacyPolicy);
router.delete('/privacy-policy/:id', SettingsControllers.DeletePrivacyPolicy);
export const SettingsRoutes = router;
//# sourceMappingURL=settings.route.js.map