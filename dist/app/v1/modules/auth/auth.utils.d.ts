import { type JwtPayload } from 'jsonwebtoken';
export declare const createToken: (jwtPayload: {
    user_id: string;
    role: string;
}, secret: string, expiresIn: number) => string;
export declare const verifyToken: (token: string, secret: string) => JwtPayload;
//# sourceMappingURL=auth.utils.d.ts.map