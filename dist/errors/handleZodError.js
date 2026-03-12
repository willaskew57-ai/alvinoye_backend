import httpStatus from 'http-status';
import { ZodError } from 'zod';
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => {
        const path = String(issue.path[issue.path.length - 1] ?? 'unknown');
        return {
            path,
            message: issue.message,
        };
    });
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: 'Validation Error!',
        errorSources,
    };
};
export default handleZodError;
//# sourceMappingURL=handleZodError.js.map