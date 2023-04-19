import { model, Schema } from 'mongoose';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: [String]
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);