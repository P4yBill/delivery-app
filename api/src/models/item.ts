import { model, Schema, Types } from 'mongoose';

export interface IItem {
    id: string;
    title: string;
    description: string;
    category: Types.ObjectId;
    cost: number;
}

const itemSchema = new Schema<IItem>({
    title: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    cost: { type: Number, required: true },
});

export const Item = model<IItem>('Item', itemSchema);