import { JwtPayload } from 'jsonwebtoken';

// define a type index.d.ts in interface folder to assign this req.user type globally.
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
