// import type { AnyZodObject } from 'zod/v3';

import type { AnyZodObject } from 'zod/v3';

// ** import local files
import catchAsync from '../utils/catch-async';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({ body: req.body, cookies: req.cookies });
    next();
  });
};

export default validateRequest;
