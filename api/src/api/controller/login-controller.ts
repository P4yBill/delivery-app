import { Request, Response } from "express";
import LoginUsecase from "../../usecase/login-usecase";
import { HttpCode } from "../../utils/http-status-codes";
import { createJwtAccessToken } from "../../utils/token";
import { TOKEN_TYPE } from "../middleware/auth-middleware";
import { LoginResponse, UnauthorizedResponse } from "../../domain/response/login-response";
import { logError } from "../../utils/logger";
import { ENV } from "../../config/env";

/**
 * Controller for login
 * @param {LoginUsecase} loginUsecase 
*/
const LoginController = (loginUsecase: LoginUsecase) => ({
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await loginUsecase.validateCredentials(email, password);
            const access_token = createJwtAccessToken(user);
            const userResponseObject: LoginResponse = { access_token, token_type: TOKEN_TYPE, expires_in: ENV.accessTokenExpiryHour * 3600, username: user.username };

            res.status(HttpCode.OK).json(userResponseObject);
        } catch (err: any) {
            const message = logError(err, 'Login Failed');
            const responseObject: UnauthorizedResponse = { success: false, message };

            res.status(HttpCode.Unauthorized).json(responseObject);
        }

    },
});

export default LoginController;

