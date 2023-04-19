import { RedisClientType, createClient } from 'redis';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

/**
 * @class Singleton that uses Redis
 */
export default class RedisService {
    private static instance: RedisService;
    private static redisClient: RedisClientType;

    private constructor() {
        const url = `redis://${ENV.redisHost}:${ENV.redisPort}`;

        RedisService.redisClient = createClient({ url });
    }

    public static getInstance() {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public getClient(): RedisClientType {
        return RedisService.redisClient;
    }

    public async connect() {
        const redisClient = RedisService.redisClient;

        redisClient.on("error", (error) => logger.error(error));

        await redisClient.connect();
    }
}
