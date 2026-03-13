"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatZodError = void 0;
const formatZodError = (error) => {
    const errors = {};
    error.issues.forEach((issue) => {
        const path = issue.path.filter((p) => p !== 'body').join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });
    return errors;
};
exports.formatZodError = formatZodError;
//# sourceMappingURL=zodErrorFormatter.js.map