import { NextFunction, Request, Response } from "express";
import { IUserRepository } from "../../repository/user-repository";
import { HttpCode } from "../../utils/http-status-codes";
import { verifyToken } from "../../utils/token";
import { IUser } from "../../models/user";
import { logError } from "../../utils/logger";
import { ValidationError } from "../../utils/errors";
import { JsonWebTokenError } from "jsonwebtoken";

export interface AuthUser {
    id: string;
    email: string;
}

export interface AuthRequest extends Request {
    user: AuthUser;
}

export const AUTH_HEADER = 'Authorization';
export const TOKEN_TYPE = 'Bearer';

/**
 * Returns a middleware based on the passed user repository.
 * 
 * User repository is used to check if the user that was extracted from the token
 * exists in the database
 * 
 * @param {IUserRepository} ur Required user repository
 * @returns Middleware
 */
export function getAuthenticator(ur: IUserRepository) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const token = getTokenFromRequest(req);

            if (!token) {
                throw new ValidationError('token');
            }
            const decodedPayload = verifyToken(token);

            const user: IUser = await ur.getUserByEmail(decodedPayload.email);
            if (!user) {
                throw new ValidationError('user');
            }
            attachUserToRequest(req, user);

            next();
        } catch (err: any) {
            let json: any;
            const message = logError(err, "Not authorized");
            if (err instanceof JsonWebTokenError) {
                json = { error: 'jwt', message };
            } else {
                json = { message };
            }

            return res.status(HttpCode.Unauthorized).json(json);
        }

    }
}

export function getUserFromRequest(req: Request): AuthUser {
    return (req as AuthRequest).user;
}

function attachUserToRequest(req: Request, user: IUser) {
    (req as AuthRequest).user = { id: user.id, email: user.email };
}

/**
 * Extracts token from header.
 * 
 * @param {Request} req  
 * @returns {string} token
 */
function getTokenFromRequest(req: Request): string | undefined {
    const authHeader = req.header(AUTH_HEADER);
    return authHeader?.replace(`${TOKEN_TYPE} `, '');
}