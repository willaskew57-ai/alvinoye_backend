import { ZodError } from 'zod/v3';
import { formatZodError } from '../utils/zodErrorFormatter';
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
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
//# sourceMappingURL=validate-request.js.map