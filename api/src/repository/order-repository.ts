import { IOrder, Order } from "../models/order";
import { NoDocumentsFoundError } from "../utils/errors";

const OrderRepository = {
    /**
     * Gets all the orders sorted by the newest ones.
     * 
     * 
     * @returns {Array<IOrder>} array of orders
     */
    findAll: async (): Promise<Array<IOrder>> => {
        const orders = await Order.find({}, { '__v': 0 }).sort({ created_at: 'descending' });
        return orders ? Promise.resolve(orders) : Promise.reject('Could not retrieve orders');
    },

    findOneById: async (id: string): Promise<IOrder> => {
        const order = await Order.findById(id, { '__v': 0 });

        if (!order) {
            throw new NoDocumentsFoundError("Order not found");
        }

        return order
    },

    insertOne: async (orderInfo: IOrder): Promise<string> => {
        const order = new Order(orderInfo);
        await order.save();

        return order._id;
    }
}

export default OrderRepository;