import { createCategoryService, createClassicService, createDescriptionService, createEmojiService, createPictureService, createQuoteService, deleteCategoryService, getAllCategoriesService, getAllPublicCategories, getCategoryByIDService, getCategoryDataService } from '../services/category.service';

export const getPublicCategories = async (req, res) => {
    try {
        const categories = await getAllPublicCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCategoryByID = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }
        const category = await getCategoryByIDService(id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const createCategory = async (req, res, next) => {
    try {
        const category = req.body;
        const result = await createCategoryService(category);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createClassic = async (req, res, next) => {
    try {
        const { answer, gender, height, weight, hairColor, address, age, categoryID } = req.body;
        if (!answer || !gender || !height || !weight || !hairColor || !address || !age || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createClassicService({ answer, gender, height, weight, hairColor, address, age, categoryID });
        res.status(200).json({ result, success: true });
    } catch (error) {
        next(error);
    }
};

export const createDescription = async (req, res, next) => {
    try {
        const { answer, description, categoryID } = req.body;
        if (!answer || !description || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createDescriptionService({ answer, description, categoryID });
        res.status(200).json({ result, success: true });
    } catch (error) {
        next(error);
    }
};

export const createEmoji = async (req, res, next) => {
    try {
        const { answer, firstEmoji, secondEmoji, thirdEmoji, categoryID } = req.body;
        if (!answer || !firstEmoji || !secondEmoji || !thirdEmoji || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createEmojiService({ answer, firstEmoji, secondEmoji, thirdEmoji, categoryID });
        res.status(200).json({ result, success: true });
    } catch (error) {
        next(error);
    }
};

export const createQuote = async (req, res, next) => {
    try {
        const { answer, quote, categoryID } = req.body;
        if (!answer || !quote || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createQuoteService({ answer, quote, categoryID });
        res.status(200).json({ result, success: true });
    } catch (error) {
        next(error);
    }
};

export const createPicture = async (req, res, next) => {
    try {
        const { answer, picture, categoryID } = req.body;
        if (!answer || !picture || !categoryID) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createPictureService({ answer, picture, categoryID });
        res.status(200).json({ result, success: true });
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const result = await getAllCategoriesService();

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        next(error);
    }
};



export const getCategoryData = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getCategoryDataService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        next(error);
    }
};


export const deleteCategory = async(req,res,next) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await deleteCategoryService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error)
    }
}