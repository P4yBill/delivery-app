import { IItem } from "../../models/item";
import { IOrder } from "../../models/order";

interface DataResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface IItemResponse extends DataResponse<Array<IItem>> {
    base_currency?: string;
    target_currency?: string;
    currency_rate?: number;
}

export interface IOrderResponse extends DataResponse<Array<IOrder> | IOrder> {

}