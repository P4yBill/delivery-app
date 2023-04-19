import { model, Schema, Types } from 'mongoose';

export interface IOrderItem {
    item: Types.ObjectId;
    title: string;
    cost: number;
    quantity: number;
}

export interface IOrder {
    id?: string;
    user_email: string;
    base_currency?: string;
    target_currency?: string;
    currency_rate?: number;
    total_cost: number;
    status?: string;
    created_at: Date;
    items: Array<IOrderItem>;
}

const orderItemSchema = new Schema<IOrderItem>({
    item: { type: Schema.Types.ObjectId, ref: 'Item' },
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { _id: false });


const orderSchema = new Schema<IOrder>({
    user_email: { type: String, required: true },
    base_currency: { type: String, required: false },
    target_currency: { type: String, required: false },
    currency_rate: { type: Number, required: false },
    total_cost: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
    items: [{ type: orderItemSchema, required: true }],
});

// 3. Create a Model.
export const Order = model<IOrder>('Order', orderSchema);