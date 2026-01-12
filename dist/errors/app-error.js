class AppError extends Error {
    statusCode;
    constructor(statusCode, message, stack = '') {
        // send the message to Parent class :
        super(message);
        // set statusCode value with Constructor:
        this.statusCode = statusCode;
        // configure stack message:
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
//# sourceMappingURL=app-error.js.map