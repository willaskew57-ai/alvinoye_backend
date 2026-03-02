import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SettingsService } from './settings.service';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';

// ** -------------- Faq controller --------------
const createFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.createFaqInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'FAQ created successfully!',
    data: result,
  });
});

const getFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getAllFaqsInDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs retrieved successfully!',
    data: result,
  });
});
const getSingleFaqs = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.getSingleFaqInDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs retrieved successfully!',
    data: result,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.updateFaqInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ updated successfully!',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.deleteFaqInDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ deleted successfully!',
    data: result,
  });
});

// ** --------------- Terms route ---------------

const createTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.createTermsInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Terms and Conditions created successfully!',
    data: result,
  });
});

const getSingleTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getSingleTermsInDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and Condition retrieved successfully!',
    data: result,
  });
});

const updateTerms = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const termsId = id as string;

  const result = await SettingsService.updateTermsInDB(termsId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and Condition updated successfully!',
    data: result,
  });
});

// ** ------------ Privacy Policy Controller --------------

const createPrivacy = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.createPrivacyInDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Privacy Policy created successfully!',
    data: result,
  });
});

const getSinglePrivacy = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getSinglePrivacyInDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy retrieved successfully!',
    data: result,
  });
});

const updatePrivacy = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.updatePrivacyInDB(
    id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy updated successfully!',
    data: result,
  });
});

export const SettingsController = {
  // FAQ
  createFaq,
  getFaqs,
  getSingleFaqs,
  updateFaq,
  deleteFaq,

  // Terms
  createTerms,
  getSingleTerms,
  updateTerms,

  // Privacy
  createPrivacy,
  getSinglePrivacy,
  updatePrivacy,
};
