import { IRouter } from "express";
import Endpoints from "./endpoints";
import ItemUsecase from "../../usecase/item-usecase";
import ItemController from "../controller/item-controller";

export default function addItemRoutes(router: IRouter) {
    const itemUsecase = new ItemUsecase();
    const itemController = ItemController(itemUsecase);

    router.get(Endpoints.Item, itemController.get);
}