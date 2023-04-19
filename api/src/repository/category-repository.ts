import { Category, ICategory } from "../models/category";

const CategoryRepository = {
    findAll: async (): Promise<Array<ICategory>> => {
        const categories = await Category.find({});

        return categories ? Promise.resolve(categories) : Promise.reject('Could not retrieve categories');
    },
}

export default CategoryRepository;