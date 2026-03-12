import mongoose from 'mongoose';
import httpStatus from 'http-status';
const handleValidationError = (err) => {
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val.path,
            message: val.message,
        };
    });
    const statusCode = httpStatus.BAD_REQUEST;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
export default handleValidationError;
//# sourceMappingURL=handle-validation-error.js.map