import { FilterQuery } from "mongoose";
import { Category } from "../models/category";
import { Item, IItem } from "../models/item";

const ItemRepository = {
    findAll: async (): Promise<Array<IItem>> => {
        const items = await Item.find({}, { __v: 0 }).populate({ path: 'category', select: { __v: 0 }, model: Category });

        return items ? Promise.resolve(items) : Promise.reject('Could not retrieve items');
    },

    find: async (filter: FilterQuery<IItem>): Promise<Array<IItem>> => {
        const items = await Item.find(filter);

        return items;
    }
}

export default ItemRepository;