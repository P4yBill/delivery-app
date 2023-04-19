/**
 * This is the description of the interface
 *
 * @interface IPasswordHasher
 * @property hash {Function} function that hashes a plain text data
 * @property compare {Function} function that compares a given plain text data to an encrypted string
 */
export default interface IPasswordHasher {
    /**
     * Hashes a password and returns the encrypted hash
     * 
     * @function hash
     * @param myPlaintextPassword {string} Text password to encrypt
     * @param saltOrRounds {string | number} Given salt or rounds to be generated for the hash
     * 
     * @return {Promise<string>} Encrypted hashed password.
     */
    hash(myPlaintextPassword: string, saltOrRounds?: string | number): Promise<string>;
    /**
     * Compares given data with an encrypted string hash.
     * 
     * @param data {string | buffer} The plain data to compare with.
     * @param encrypted {string} The encrypted hash string to compare to.
     * 
     * @returns {Promise<boolean>} True if the given data parameters are the same otherwise false.
     */
    compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}