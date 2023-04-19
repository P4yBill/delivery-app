import { sign, JwtPayload, verify } from "jsonwebtoken";
import { ENV } from "../config/env";
import { IUser } from "../models/user";
import { logError } from "./logger";

export interface JwtCustomPayload extends JwtPayload {
    email: string;
    userId: string;
}

export function createJwtAccessToken(user: IUser) {
    const payload = getUserPayload(user);

    try {
        return sign(payload, ENV.accessTokenSecret, { expiresIn: ENV.accessTokenExpiryHour * 3600 });
    } catch (err: any) {
        logError(err);
        throw new Error('An error occured. Please try again');
    }
}

export function verifyToken(token: string): JwtCustomPayload {
    return <JwtCustomPayload>verify(token, ENV.accessTokenSecret);

}

function getUserPayload(user: IUser): JwtCustomPayload {
    return {
        email: user.email,
        userId: user.id,
    }
}

// TODO: implement Refresh token
// export function createJwtRefreshToken(user: IUser) {
//     let payload = getUserPayload(user);

//     try {
//         return sign(payload, ENV.refreshTokenSecret, { expiresIn: ENV.refreshTokenExpiryHour * 3600 });
//     } catch (err) {
//         throw new Error('An error occured. Please try again');
//     }
// };
