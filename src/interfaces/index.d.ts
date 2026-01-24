import { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../app/v1/modules/user/user.interface';

export interface TUserPayload extends JwtPayload {
  user_id: string;
  role: TUserRole;
  token_version?: number;
}

export interface TCustomFile extends Express.Multer.File {
  key: string;
}

declare global {
  namespace Express {
    interface Request {
      user: TUserPayload;
      files?:
        | ({
            profile_image?: TCustomFile[];
            product_image?: TCustomFile[];
            course_banner?: TCustomFile[];
            banner?: TCustomFile[];
            class_banner?: TCustomFile[];
            category_image?: TCustomFile[];
            video?: TCustomFile[];
            chat_images?: TCustomFile[];
            chat_videos?: TCustomFile[];
            thumbnail?: TCustomFile[];
          } & { [fieldname: string]: TCustomFile[] })
        | TCustomFile[];
    }
  }
}
