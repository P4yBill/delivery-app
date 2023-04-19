import { IRouter } from "express";
import UserRepository from "../../repository/user-repository";
import LoginUsecase from "../../usecase/login-usecase";
import BcryptPasswordHasher from "../../services/password-hasher/bcrypt-password-hasher";
import LoginController from "../controller/login-controller";
import Endpoints from "./endpoints";

export default function addLoginRoutes(router: IRouter) {
    const loginUsecase = new LoginUsecase(new BcryptPasswordHasher(), new UserRepository());
    const loginController = LoginController(loginUsecase);

    router.post(Endpoints.Login, loginController.login);
}