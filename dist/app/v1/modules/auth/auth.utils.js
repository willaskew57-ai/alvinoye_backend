import jwt, {} from 'jsonwebtoken';
// create token creation utils:
export const createToken = (jwtPayload, secret, expiresIn) => {
    const token = jwt.sign(jwtPayload, secret, { expiresIn });
    return token;
};
// verify jwt token :
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
//# sourceMappingURL=auth.utils.js.map