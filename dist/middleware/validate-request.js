"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v3_1 = require("zod/v3");
const zodErrorFormatter_1 = require("../utils/zodErrorFormatter");
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
        if (error instanceof v3_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: (0, zodErrorFormatter_1.formatZodError)(error),
            });
        }
        next(error);
    }
};
exports.default = validateRequest;
//# sourceMappingURL=validate-request.js.map