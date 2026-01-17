import type { Response } from 'express';


type TMeta = {
  total: number; 
  page: number; 
  limit: number; 
  totalPages: number; 
}

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  average_rating?: number;
  meta?: TMeta;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    average_rating: data.average_rating,
    meta: data.meta,
    data: data.data,
  });
};

export default sendResponse;
