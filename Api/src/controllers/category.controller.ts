import { createCategoryService, createClassicService, createDescriptionService, createEmojiService, createPictureService, createQuoteService, getAllPublicCategories, getCategoryByIDService } from '../services/category.service';

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
        const {answer, gender, height, weight, hairColor, adress, birthDate } = req.body;
        if (!answer || !gender || !height || !weight || !hairColor || !adress || !birthDate) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createClassicService(answer, gender, height, weight, hairColor, adress, birthDate);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createDescription = async (req, res, next) => {
    try {
        const {answer, desc} = req.body;
        if (!answer || !desc) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createDescriptionService(answer, desc);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createEmoji = async (req, res, next) => {
    try {
        const {answer, firstEmoji, secondEmoji, thirdEmoji} = req.body;
        if (!answer || !firstEmoji || !secondEmoji || !thirdEmoji) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createEmojiService(answer, firstEmoji, secondEmoji, thirdEmoji);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createQuote = async (req, res, next) => {
    try {
        const {answer, quote} = req.body;
        if (!answer || !quote) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createQuoteService(answer, quote);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createPicture = async (req, res, next) => {
    try {
        const {answer, picture} = req.body;
        if (!answer || !picture) {
            return res.status(400).json({ success: false, message: "Hiányzó adatok!" });
        }
        const result = await createPictureService(answer, picture);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}