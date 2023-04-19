import winston from 'winston'


export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: "error.log", level: "warn" }),
        // new winston.transports.File({ filename: "app.log" }),
    ],
});

/**
 * Logs the error with the winston logger and returns the error message
 * 
 * @param err error object. 
 * @param {string} fallbackMessage Message that will be logged if err has no message property.
 * @returns {string} The error message
 */
export function logError(err: any, fallbackMessage = 'Something went wrong. Please try again later.'): string {
    let message: string;
    if (err instanceof Error) {
        message = err.message;
    } else {
        message = fallbackMessage;
    }

    logger.error(message);
    return message;
}