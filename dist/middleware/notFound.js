import httpStatus from 'http-status';
export const notFound = (req, res, next) => {
    return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API Not Found',
        error: 'Check your API documentation for available endpoints',
    });
};
//# sourceMappingURL=notFound.js.map