
import { JwtPayload } from 'jsonwebtoken';
import type { TUserRole } from '../app/v1/modules/user/user.interface';

export interface TUserPayload extends JwtPayload {
  user_id: string;
  role: TUserRole;
  token_version?: number;
}

declare global {
  namespace Express {
    interface Request {
      user: TUserPayload;
    }
  }
}