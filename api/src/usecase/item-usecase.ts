import { Request } from "express";
import { IItem } from "../models/item";
import ItemRepository from "../repository/item-repository";
import { FixerHttpRequest, FixerResponse } from "../services/request/fixer-http-request";
import { validateCurrencySymbol } from "../utils/validators";
import { IItemResponse } from "../domain/response/response";
import { ValidationError } from "../utils/errors";

export default class ItemUsecase {
    public static BaseCurrency = 'EUR';

    /**
     * Returns all the items
     * 
     * @returns {Promise<Array<IITem>>} items
     */
    public async getAllItems(): Promise<Array<IItem>> {
        return await ItemRepository.findAll();
    }

    /**
     * Returns the items response object.
     * 
     * @param req 
     * @returns {Promise<IItemResponse>} the Item response object
     */
    public async getItemsResponseData(req: Request): Promise<IItemResponse> {
        const currency: string = req.query.currency?.toString() || '';

        try {
            // check if there is a target currency in the request
            // in order to make additional request for the currency rate.
            if (currency && this.isDiffFromBase(currency)) {
                if (!validateCurrencySymbol(currency)) {
                    throw new ValidationError('currency');
                }
                const allData = await Promise.all([this.getFixerData(currency), this.getAllItems()]);
                const [fixerResponse, items] = allData;

                return this.getResponseWithCurrencyRates(currency, fixerResponse, items);
            } else {
                const items = await this.getAllItems();
                return this.getResponseWithItems(items);
            }
        } catch (err: any) {
            throw err;
        }
    }

    /**
     * Retrieves currency rates using fixer.io.
     * 
     * @param {string} currency 
     * @returns {FixerResponse} Currency rates data
     */
    private async getFixerData(currency: string): Promise<FixerResponse> {
        try {
            const fixerRequest = new FixerHttpRequest({ base: ItemUsecase.BaseCurrency, symbols: currency });

            return await fixerRequest.getLatest();
        } catch (err: any) {
            throw err;
        }
    }

    /**
     * Construct item response object without currency rate information
     * @param {Array<IItem>} items 
     * @returns {IItemResponse} Item response object
     */
    private getResponseWithItems(items: Array<IItem>): IItemResponse {
        return {
            success: true,
            data: items
        }
    }

    /**
     * Construct the response object with currency rate information.
     * 
     * @param {string} currency Specified currency for the currency rates
     * @param {FixerResponse} fixerResponse Containing currency rates
     * @param {Array<IItem>} items To be attached to the response object
     * @returns {IItemResponse} Item response object
     */
    private getResponseWithCurrencyRates(currency: string, fixerResponse: FixerResponse, items: Array<IItem>): IItemResponse {
        return {
            success: true,
            currency_rate: fixerResponse.rates?.[currency],
            base_currency: ItemUsecase.BaseCurrency,
            target_currency: currency,
            data: items
        };
    }

    /**
     * Check if specified currency is different from Base Currency
     * 
     * @param {currency} currency To be compared
     * @returns 
     */
    private isDiffFromBase(currency: string): boolean {
        return currency !== ItemUsecase.BaseCurrency;
    }
}