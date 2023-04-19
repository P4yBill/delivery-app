import { User, IUser } from "../models/user";
import { NoDocumentsFoundError } from "../utils/errors";

export interface IUserRepository {
    getUserById(id: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser>
}

export default class UserRepository implements IUserRepository {
    public async getUserById(id: string): Promise<IUser> {
        const user = await User.findById(id);

        if (!user) {
            throw new NoDocumentsFoundError("User not found");
        }

        return user;
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        const user = await User.findOne({ email });

        if (!user) {
            throw new NoDocumentsFoundError("User not found");
        }

        return user;
    }
}