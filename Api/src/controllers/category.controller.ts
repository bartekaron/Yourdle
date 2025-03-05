import { createCategoryService, createClassicService, createDescriptionService, createEmojiService, createPictureService, createQuoteService, getAllPublicCategories } from '../services/category.service';

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

export const createClassic = async (req, res, next) => {
    try {
        const classic = req.body;
        const result = await createClassicService(classic);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createDescription = async (req, res, next) => {
    try {
        const description = req.body;
        const result = await createDescriptionService(description);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createEmoji = async (req, res, next) => {
    try {
        const emoji = req.body;
        const result = await createEmojiService(emoji);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createQuote = async (req, res, next) => {
    try {
        const quote = req.body;
        const result = await createQuoteService(quote);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}

export const createPicture = async (req, res, next) => {
    try {
        const picture = req.body;
        const result = await createPictureService(picture);
        res.status(200).json({result, success: true});
    } catch (error) {
        next(error);
    }

}