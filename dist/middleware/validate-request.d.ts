import { type AnyZodObject } from 'zod/v3';
import type { Request, Response, NextFunction } from 'express';
declare const validateRequest: (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateRequest;
//# sourceMappingURL=validate-request.d.ts.map