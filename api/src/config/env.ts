// type AppEnv = 'dev' | 'prod';
import dotenv from "dotenv";
dotenv.config();

enum AppEnv {
    DEV = 'development',
    PROD = 'production'
}

export interface Env {
    nodeEnv: AppEnv;
    port: number;
    host: string;
    accessTokenExpiryHour: number;
    accessTokenSecret: string;
    dbHost: string;
    dbPort: string;
    dbName: string;
    fixerAccessKey: string;
    redisFixerCacheExpire: number;
    redisHost: string;
    redisPort: string;
    // dbPass: string;
    // dbName: string;
}

export const ENV: Env = {
    nodeEnv: process.env.NODE_ENV as AppEnv || AppEnv.PROD,
    port: Number(process.env.PORT) || 8080,
    host: process.env.HOST || 'localhost',
    accessTokenExpiryHour: Number(process.env.ACCESS_TOKEN_EXPIRY_HOUR),
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    dbHost: String(process.env.DB_HOST),
    dbPort: String(process.env.DB_PORT),
    dbName: String(process.env.DB_NAME),
    fixerAccessKey: String(process.env.FIXER_ACCESS_KEY),
    redisFixerCacheExpire: Number(process.env.REDIS_FIXER_CACHE_EXPIRE),
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || '6379',
}
