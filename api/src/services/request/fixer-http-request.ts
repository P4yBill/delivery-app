import { AxiosRequestConfig } from "axios";
import { ENV } from "../../config/env";
import { logger } from "../../utils/logger";
import RedisService from "../redis-service";
import HttpRequest from "./http-request";

export interface FixerParams {
    base: string;
    // delimited by comma, ex. USD,CAD,JPY
    symbols: string;
}

interface FixerConfigParams extends FixerParams {
    access_key: string;
}

interface FixerRequestConfig extends AxiosRequestConfig<FixerConfigParams> { }

export type FixerResponse = {
    success: boolean;
    base?: string;
    date?: string;
    rates?: Record<string, number>;
    timestamp?: number;
    error?: { code: number, type: string };
}

/**
 * @class Wrapper for fixer io endpoints
 * It can be used to request the latest currency rates.
 */
export class FixerHttpRequest {
    private requestConfig: FixerRequestConfig;
    private static fixerIoEndpointLatest = 'http://api.apilayer.com/fixer/latest';

    constructor(fixerParams: FixerParams) {
        const params: FixerConfigParams = { ...fixerParams, access_key: ENV.fixerAccessKey };

        this.requestConfig = { params, timeout: 2000 };
    }

    /**
     * Retrieves currency rates from redis cache,
     * otherwise it makes a request to Fixer.io to get the latest currency rates.
     * 
     * @returns {FixerResponse} Currency rates data
     */
    public async getLatest(): Promise<FixerResponse> {
        try {
            const currency = this.requestConfig.params.symbols;

            const redisClient = RedisService.getInstance().getClient();
            const cachedCurrency = await redisClient.get(currency);

            if (cachedCurrency) {
                logger.info(`Served ${currency} from redis cache`);
                return JSON.parse(cachedCurrency);
            } else {
                const res = await HttpRequest.get<FixerResponse>(FixerHttpRequest.fixerIoEndpointLatest, this.requestConfig);
                // const res = await this.dummyResponse();

                if (!res?.data.success) {
                    return Promise.reject(res.data.error?.type);
                }
                redisClient.set(currency, JSON.stringify(res.data), {
                    EX: ENV.redisFixerCacheExpire,
                    NX: true,
                });

                return res.data;
            }
        } catch (err: any) {
            throw new Error('Could not get currency rates')
        }
    }

    // private async dummyResponse(): Promise<any> {
    //     return {
    //         status: 200,
    //         data: {
    //             "success": true,
    //             "timestamp": 1519296206,
    //             "base": "EUR",
    //             "date": "2023-04-11",
    //             "rates": {
    //                 "GBP": 0.72007,
    //                 "JPY": 107.346001,
    //                 "USD": 0.813399,
    //             }
    //         }
    //     }
    // }
}