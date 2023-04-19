import { Request, Response } from "express";
import { HttpCode } from "../../utils/http-status-codes";
import OrderUsecase from "../../usecase/order-usecase";
import { logError } from "../../utils/logger";
import { IOrderResponse } from "../../domain/response/response";
import { ValidationError } from "../../utils/errors";

/**
 * Controller for orders
 * @param {OrderUsecase} orderUsecase 
*/
const OrderController = (orderUsecase: OrderUsecase) => ({
    get: async (req: Request, res: Response) => {
        try {
            const orders = await orderUsecase.getAllOrders();
            const orderResponse: IOrderResponse = {
                success: true,
                data: orders
            };
            return res.status(HttpCode.OK).json(orderResponse);
        } catch (err: any) {
            logError(err);
            const responseObject: IOrderResponse = { success: false, message: 'Could not retrieve items' };

            return res.status(HttpCode.BadRequest).json(responseObject);
        }
    },

    create: async (req: Request, res: Response) => {
        try {
            const id = await orderUsecase.createOrder(req.body);

            return res.status(HttpCode.Created).json({
                success: true,
                id
            });
        } catch (err: any) {
            // unwrap message from err and log the error.
            const message = logError(err);
            const responseObject: IOrderResponse = { success: false, message };

            if (err instanceof ValidationError) {
                return res.status(HttpCode.BadRequest).json(responseObject);
            }

            return res.status(HttpCode.InternalServerError).json(responseObject);
        }
    },

    // getOne: async (req: Request, res: Response) => {
    //     try {
    //         const order = await orderUsecase.getOneOrder(req.params.id);
    //         const orderResponse: IOrderResponse = {
    //             success: true,
    //             data: order
    //         }
    //         return res.status(HttpCode.OK).json(orderResponse);
    //     } catch (err: any) {
    //         const message = err?.message;
    //         const responseObject: IOrderResponse = { success: false, message };

    //         if (err instanceof ValidationError) {
    //             return res.status(HttpCode.BadRequest).json(responseObject);
    //         }

    //         if (err instanceof NoDocumentsFoundError) {
    //             return res.status(HttpCode.NotFound).send();
    //         }

    //         return res.status(HttpCode.InternalServerError).send();
    //     }
    // },
});

export default OrderController;

