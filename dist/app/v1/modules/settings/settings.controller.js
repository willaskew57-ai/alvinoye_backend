import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catchAsync';
import { SettingsServices } from './settings.services';
import sendResponse from '../../../../utils/sendResponse';
import AppError from '../../../../errors/app-error';
const CreatePrivacyPolicy = catchAsync(async (req, res) => {
    const result = await SettingsServices.createPrivacyPolicyIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Privacy Policy created',
        data: result,
    });
});
const GetPrivacyPolicy = catchAsync(async (req, res) => {
    const result = await SettingsServices.getPrivacyPolicyFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Privacy Policy retrieved',
        data: result,
    });
});
const UpdatePrivacyPolicy = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
    }
    const result = await SettingsServices.updatePrivacyPolicyIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Privacy Policy updated',
        data: result,
    });
});
const DeletePrivacyPolicy = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError(httpStatus.BAD_REQUEST, 'ID is required');
    }
    await SettingsServices.deletePrivacyPolicyFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Policy deleted',
        data: null,
    });
});
export const SettingsControllers = {
    CreatePrivacyPolicy,
    GetPrivacyPolicy,
    UpdatePrivacyPolicy,
    DeletePrivacyPolicy,
};
//# sourceMappingURL=settings.controller.js.map