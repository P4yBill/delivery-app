import { IRouter } from "express";
import OrderUsecase from "../../usecase/order-usecase";
import OrderController from "../controller/order-controller";

export default function addOrderRoutes(merchantRouter: IRouter, publicRouter: IRouter) {
    const orderUsecase = new OrderUsecase();
    const orderController = OrderController(orderUsecase);

    merchantRouter.get('/order', orderController.get);
    // merchantRouter.get('/order/:id', orderController.getOne);
    publicRouter.post('/order', orderController.create);
}