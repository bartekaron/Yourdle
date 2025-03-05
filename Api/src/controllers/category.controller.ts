import { createCategoryService, getAllPublicCategories } from '../services/category.service';

export const getPublicCategories = async (req, res) => {
    try {
        const categories = await getAllPublicCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const category = req.body;
        const result = await createCategoryService(category);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}