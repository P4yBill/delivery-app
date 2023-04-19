import { IOrder, IOrderItem } from '../models/order';
import OrderRepository from '../repository/order-repository';
import {
    isStringValid,
    isValidObjectId,
    validateCurrencySymbol,
    validateEmail,
} from '../utils/validators';
import ItemRepository from '../repository/item-repository';
import { IItem } from '../models/item';
import { Types } from 'mongoose';
import ItemUsecase from './item-usecase';
import {
    FixerHttpRequest,
} from '../services/request/fixer-http-request';
import { InternalServerError, ValidationError } from '../utils/errors';

type OrderItemRequest = {
    item: string;
    quantity: number;
};

type CreateOrderRequestBody = {
    userEmail: string;
    targetCurrency?: string;
    items: Array<OrderItemRequest>;
};

export default class OrderUsecase {
    private static MAX_ORDER_ITEMS = 100;

    public async getAllOrders(): Promise<Array<IOrder>> {
        return await OrderRepository.findAll();
    }

    /**
     * Creates order from body request and saves it in the database
     *
     * @param jsonBody
     * @returns {string} id of the created order.
     */
    public async createOrder(jsonBody: any): Promise<string> {
        try {
            const items = await this.validateParams(jsonBody);
            const order = await this.constructOrder(jsonBody, items);

            const createdOrderId: string = await OrderRepository.insertOne(
                order
            );

            return createdOrderId;
        } catch (err: any) {
            if (err instanceof Error) {
                throw err;
            }
            const message = err?.message || 'Something went wrong';
            throw new Error(message);
        }
    }

    public async getOneOrder(id: string): Promise<IOrder> {
        if (!id || !isValidObjectId(id)) {
            throw new ValidationError('Wrong input id given');
        }

        return await OrderRepository.findOneById(id);
    }

    /**
     * Validates the order items param that contain the items of the order.
     * If validation succeeds it returns the corresponding items from the database,
     * Otherwise throws an error.
     *
     * @throws Error if validation fails
     * @param body
     * @returns {Array<IItem>} Item of the order.
     */
    private async validateParams(
        body: CreateOrderRequestBody
    ): Promise<Array<IItem>> {
        const { userEmail, targetCurrency } = body;
        const orderItems: Array<OrderItemRequest> = body.items;

        if (!isStringValid(userEmail) || !validateEmail(userEmail)) {
            throw new ValidationError('userEmail');
        }

        if (targetCurrency && !validateCurrencySymbol(targetCurrency)) {
            throw new ValidationError('targetCurrency');
        }

        if (!Array.isArray(orderItems) || !orderItems.length) {
            throw new ValidationError('items');
        }

        const hasValidObjectIds = orderItems.every(
            (orderItem) =>
                orderItem.quantity > 0 &&
                orderItem.quantity < OrderUsecase.MAX_ORDER_ITEMS &&
                isValidObjectId(orderItem?.item?.toString())
        );

        // before querying db, check if object ids are valid
        if (!hasValidObjectIds) {
            throw new ValidationError('items');
        }

        const orderItemIds = orderItems.map(
            (orderItemReq) => orderItemReq.item
        );
        const items: Array<IItem> = await ItemRepository.find({
            _id: { $in: orderItemIds },
        });

        // check if all items exist in db
        const allItemsExist = items.length === orderItems.length;
        if (!allItemsExist) {
            throw new ValidationError('items');
        }

        return items;
    }

    private async constructOrder(
        body: CreateOrderRequestBody,
        items: Array<IItem>
    ): Promise<IOrder> {
        const { userEmail, targetCurrency } = body;
        const orderItems: Array<OrderItemRequest> = body.items;

        const orderItemIdMapper: Record<string, OrderItemRequest> = {};
        orderItems.forEach(
            (orderItem) => (orderItemIdMapper[orderItem.item] = orderItem)
        );

        const total_cost = items.reduce((accumulator, item) => {
            return (
                accumulator + item.cost * orderItemIdMapper[item.id].quantity
            );
        }, 0);

        const order: IOrder = {
            user_email: userEmail,
            total_cost,
            created_at: new Date(),
            items: items.map(
                (item): IOrderItem => ({
                    item: Types.ObjectId(item.id),
                    cost: item.cost,
                    title: item.title,
                    quantity: orderItemIdMapper[item.id].quantity,
                })
            ),
        };

        // if currency provided equals base currency, no need to find rates
        if (targetCurrency && targetCurrency !== ItemUsecase.BaseCurrency) {
            try {
                const fixerRequest = new FixerHttpRequest({
                    base: ItemUsecase.BaseCurrency,
                    symbols: targetCurrency,
                });
                const fixerRes = await fixerRequest.getLatest();

                const rate = fixerRes.rates?.[targetCurrency];
                if (!rate) {
                    throw new InternalServerError(
                        'Could not retrieve currency rate'
                    );
                }

                order.base_currency = ItemUsecase.BaseCurrency;
                order.target_currency = targetCurrency;
                order.currency_rate = rate;
            } catch (err: any) {
                throw new Error(err?.message);
            }
        }

        return order;
    }
}
