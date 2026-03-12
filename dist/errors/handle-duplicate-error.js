import httpStatus from 'http-status';
const handleDuplicateError = (err) => {
    const keyPattern = err.keyPattern || {};
    const key = Object.keys(keyPattern)[0];
    const keyValue = err.keyValue?.[key];
    const errorSources = [
        {
            path: key || 'unknown',
            message: `"${keyValue || 'this value'}" already exists`,
        },
    ];
    const statusCode = httpStatus.BAD_REQUEST;
    return {
        statusCode,
        message: `Duplicate field value: ${key || 'unknown'} already exists`,
        errorSources,
    };
};
export default handleDuplicateError;
//# sourceMappingURL=handle-duplicate-error.js.map