import mongoose from 'mongoose';
import type { ISendErrorResponse } from '../interfaces/errors';
declare const handleValidationError: (err: mongoose.Error.ValidationError) => ISendErrorResponse;
export default handleValidationError;
//# sourceMappingURL=handle-validation-error.d.ts.map