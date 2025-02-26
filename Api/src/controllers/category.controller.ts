import { getAllPublicCategories } from '../services/category.service';

export const getPublicCategories = async (req, res) => {
    try {
        const categories = await getAllPublicCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};