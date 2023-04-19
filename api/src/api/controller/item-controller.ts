import { Request, Response } from "express";
import ItemUsecase from "../../usecase/item-usecase";
import { HttpCode } from "../../utils/http-status-codes";
import { IItemResponse } from "../../domain/response/response";
import { logError } from "../../utils/logger";
import { ValidationError } from "../../utils/errors";

/**
 * Controller for items
 * @param {ItemUsecase} itemUsecase 
*/
const ItemController = (itemUsecase: ItemUsecase) => ({
    get: async (req: Request, res: Response) => {
        try {
            const itemsJson = await itemUsecase.getItemsResponseData(req);
            return res.status(HttpCode.OK).json(itemsJson);
        } catch (err: any) {
            const message = logError(err, 'Could not retrieve items');
            const responseObject: IItemResponse = { success: false, message };
            if (err instanceof ValidationError) {
                return res.status(HttpCode.BadRequest).json(responseObject);
            }


            return res.status(HttpCode.InternalServerError).json(responseObject);
        }

    },
});

export default ItemController;

