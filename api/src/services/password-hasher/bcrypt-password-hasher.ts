import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import IPasswordHasher from './password-hasher';

const DEFAULT_SALT_ROUNDS = 10;

export default class BcryptPasswordHasher implements IPasswordHasher {

    public async hash(myPlaintextPassword: string, saltOrRounds: string | number = DEFAULT_SALT_ROUNDS): Promise<string> {
        try {
            const hashedPassword = await bcryptHash(myPlaintextPassword, saltOrRounds);
            return hashedPassword;
        } catch (err: any) {
            throw err;
        }
    }

    public async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
        try {
            return await bcryptCompare(data, encrypted);
        } catch (err: any) {
            throw err;
        }
    }
}