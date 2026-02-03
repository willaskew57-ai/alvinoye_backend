import { type AnyZodObject, ZodError } from 'zod/v3';
import type { Request, Response, NextFunction } from 'express';
import { formatZodError } from '../utils/zodErrorFormatter';

 const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formatZodError(error),
        });
      }

      next(error);
    }
  };

  export default validateRequest;
