import mongoose from 'mongoose';
import type { ISendErrorResponse } from '../interfaces/errors';
declare const handleCastError: (err: mongoose.Error.CastError) => ISendErrorResponse;
export default handleCastError;
//# sourceMappingURL=handle-cast-error.d.ts.map