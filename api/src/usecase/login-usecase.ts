import { IUser } from "../models/user";
import UserRepository from "../repository/user-repository";
import { ValidationError } from "../utils/errors";
import IPasswordHasher from "../services/password-hasher/password-hasher";
import { isStringValid, validateEmail } from "../utils/validators";

export default class LoginUsecase {
    private passwordHasher: IPasswordHasher;
    private userRepository: UserRepository;

    constructor(passwordHasher: IPasswordHasher, userRepository: UserRepository) {
        this.passwordHasher = passwordHasher;
        this.userRepository = userRepository;
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return await this.userRepository.getUserByEmail(email);
    }

    public async getUserById(id: string): Promise<IUser> {
        return await this.userRepository.getUserById(id);
    }

    /**
     * Validates user with given email and password
     * 
     * @param email Email of the user to be validated
     * @param password password of the user to be validated
     * @throws {ValidationError} with message if credentials are invalid
     * 
     * @returns {User} object containing user information if validation succeeds.
     */
    public async validateCredentials(email: string, password: string): Promise<IUser> {
        if (!isStringValid(email) || !isStringValid(password) || !validateEmail(email)) {
            throw new ValidationError('', 'Invalid Credentials');
        }

        const user = await this.getUserByEmail(email);
        const valid = await this.passwordHasher.compare(password, user.password);
        if (!valid) {
            throw new ValidationError('', 'Invalid Credentials');
        }
        return user;
    }
}