import { model, Schema } from 'mongoose';

export interface ICategory {
    id: string;
    name: string;
}

const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
});

// 3. Create a Model.
export const Category = model<ICategory>('Category', categorySchema);