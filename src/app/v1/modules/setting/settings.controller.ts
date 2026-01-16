import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SettingsService } from './settings.service';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';

const createFaq = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.createFaq(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'FAQ created successfully!',
    data: result,
  });
});

const getFaqs = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getAllFaqs();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQs retrieved successfully!',
    data: result,
  });
});

const updateFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.updateFaq(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ updated successfully!',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SettingsService.deleteFaq(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'FAQ deleted successfully!',
    data: result,
  });
});

const manageTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.updateTerms(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and Conditions updated successfully!',
    data: result,
  });
});

const getTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getTerms();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and Conditions retrieved successfully!',
    data: result,
  });
});

const managePrivacy = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.updatePrivacy(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy updated successfully!',
    data: result,
  });
});

const getPrivacy = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingsService.getPrivacy();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy retrieved successfully!',
    data: result,
  });
});

export const SettingsController = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
  manageTerms,
  getTerms,
  managePrivacy,
  getPrivacy,
};