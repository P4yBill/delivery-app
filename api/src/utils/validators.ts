import mongoose from 'mongoose';

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function onlyUppercaseLetters(str: string): boolean {
    return /^[A-Z]*$/.test(str);
}

export function isValidObjectId(str: string): boolean {
    return mongoose.isValidObjectId(str);
}

export function isStringValid(str: string): boolean {
    return typeof str === 'string' && str?.trim()?.length > 0;
}

/**
 * Checks if given symbol param is a currency symbol
 * TODO: Enhace this function and check if 3 letter string belongs to a Set of real defined symbols.
 * 
 * @param symbol Symbol to be compared
 * @returns {boolean} True if its a symbol otherwise false
 */
export function validateCurrencySymbol(symbol: string): boolean {
    return symbol?.length === 3 && onlyUppercaseLetters(symbol);
}

export function validateEmail(email: string): boolean {
    return emailRegex.test(email);
}
