import { Router, Express } from "express";
import { getAuthenticator } from "../middleware/auth-middleware";
import addLoginRoutes from "./login";
import addItemRoutes from "./item";
import addOrderRoutes from "./order";
import UserRepository from "../../repository/user-repository";

export const API_ROUTE = '/api/v1/'

export default function setupRouter(app: Express) {
    const publicRouter = Router();
    addLoginRoutes(publicRouter);

    const publicApiRouter = Router();
    const apiRouter = Router();

    addItemRoutes(publicApiRouter);

    const merchantApiRouter = Router();

    // TODO: refactor to inject only one user repository
    merchantApiRouter.use(getAuthenticator(new UserRepository()));

    addOrderRoutes(merchantApiRouter, publicApiRouter);

    apiRouter.use(publicApiRouter);
    apiRouter.use(merchantApiRouter);

    app.use(API_ROUTE, apiRouter);
    app.use(publicRouter);
}